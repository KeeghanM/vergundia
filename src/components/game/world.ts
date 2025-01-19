import type { Biome, BiomeConfig, ChunkCache } from './index.t'
import { NoiseGenerator } from '../../lib/noiseGenerator'
import { TerrainSystem } from './terrainSystem'
import { biomes } from './dataFiles/biomes'
import type { ServiceContainer } from '../../lib/serviceContainer'

export class World {
  private container: ServiceContainer

  // World gen
  private biomeSystems: {
    biome: Biome
    terrainSystem: TerrainSystem
  }[]
  private heightNoise: NoiseGenerator
  private heightDetailNoise: NoiseGenerator
  private temperatureNoise: NoiseGenerator
  private temperatureDetailNoise: NoiseGenerator
  private moistureNoise: NoiseGenerator
  private moistureDetailNoise: NoiseGenerator

  // Caching
  private readonly CHUNK_SIZE = 32 // Must be power of 2 for bit operations
  private readonly CHUNK_MASK = this.CHUNK_SIZE - 1 // For fast modulo
  private chunks: Map<string, ChunkCache>

  constructor(container: ServiceContainer) {
    this.container = container
    this.chunks = new Map()

    // Initialize noise generators without scales
    this.heightNoise = new NoiseGenerator({ scale: 0.002 })
    this.heightDetailNoise = new NoiseGenerator({ influence: 0.2, scale: 0.8 })

    this.temperatureNoise = new NoiseGenerator({ scale: 0.005 })
    this.temperatureDetailNoise = new NoiseGenerator({
      influence: 0.2,
      scale: 0.8,
    })
    this.moistureNoise = new NoiseGenerator({ scale: 0.008 })
    this.moistureDetailNoise = new NoiseGenerator({
      influence: 0.2,
      scale: 0.8,
    })

    // Initialize biome systems
    this.biomeSystems = Object.values(biomes).map((biome) => ({
      biome,
      terrainSystem: new TerrainSystem(biome.terrainTypes),
    }))
  }

  private getChunkKey(x: number, y: number): string {
    return (x >> 5) + ',' + (y >> 5) // Divide by CHUNK_SIZE using bit shift
  }

  private getLocalCoords(x: number, y: number): [number, number] {
    // Fast modulo using bitwise AND with mask
    return [x & this.CHUNK_MASK, y & this.CHUNK_MASK]
  }

  cleanCache() {
    if (this.chunks.size > 32) {
      // Keep last 16 chunks
      const oldestKeys = Array.from(this.chunks.keys()).slice(0, 4)
      oldestKeys.forEach((key) => this.chunks.delete(key))
    }
  }

  private normalizeTerrain(value: number): number {
    return (value + 1) / 2
  }

  private getTerrainValue(
    x: number,
    y: number,
    biomeConfig: BiomeConfig
  ): number {
    const terrainScale = biomeConfig.terrainScale
    const smallFeatureScale = biomeConfig.smallFeatureScale
    const smallFeatureInfluence = biomeConfig.smallFeatureInfluence

    // Apply biome-specific scales when sampling noise
    const baseHeight = this.heightNoise.getValue(
      x * terrainScale,
      y * terrainScale
    )
    const detailHeight =
      this.heightDetailNoise.getValue(
        x * (terrainScale * smallFeatureScale),
        y * (terrainScale * smallFeatureScale)
      ) * smallFeatureInfluence

    return baseHeight + detailHeight
  }

  private getEnvironmentConditions(x: number, y: number) {
    // Temperature and moisture stay the same (biome-level)
    const baseTemp = this.temperatureNoise.getValue(x, y)
    const detailTemp = this.temperatureDetailNoise.getValue(x, y) * 0.5
    const temp = this.normalizeTerrain(baseTemp + detailTemp)

    const baseMoisture = this.moistureNoise.getValue(x, y)
    const detailMoisture = this.moistureDetailNoise.getValue(x, y) * 0.5
    const moisture = this.normalizeTerrain(baseMoisture + detailMoisture)

    // Height now uses default scales for biome selection
    const baseHeight = this.heightNoise.getValue(x, y)
    const detailHeight = this.heightDetailNoise.getValue(x, y) * 0.5

    const height = this.normalizeTerrain(baseHeight + detailHeight)

    return { height, moisture, temp }
  }

  getTerrain(x: number, y: number) {
    const chunkKey = this.getChunkKey(x, y)
    let chunk = this.chunks.get(chunkKey)

    if (chunk) {
      const [localX, localY] = this.getLocalCoords(x, y)
      return chunk.terrainData[localX][localY]
    }

    // If chunk doesn't exist, generate it
    chunk = {
      terrainData: Array(this.CHUNK_SIZE)
        .fill(null)
        .map(() => Array(this.CHUNK_SIZE).fill(null)),
    }

    // Calculate chunk origin
    const chunkX = (x >> 5) << 5 // Multiply and divide by CHUNK_SIZE using bit shifts
    const chunkY = (y >> 5) << 5

    // Generate all terrain in chunk
    for (let dx = 0; dx < this.CHUNK_SIZE; dx++) {
      for (let dy = 0; dy < this.CHUNK_SIZE; dy++) {
        const worldX = chunkX + dx
        const worldY = chunkY + dy

        const { height, temp, moisture } = this.getEnvironmentConditions(
          worldX,
          worldY
        )
        const { biome, terrainSystem } = this.getBiomeForConditions(
          worldX,
          worldY,
          height,
          temp,
          moisture
        )
        const terrainValue = this.getTerrainValue(worldX, worldY, biome.config)
        chunk.terrainData[dx][dy] = {
          biomeName: biome.name,
          terrain: terrainSystem.getTerrainForValue(terrainValue),
        }
      }
    }

    // Store chunk
    this.chunks.set(chunkKey, chunk)

    // Return requested terrain
    const [localX, localY] = this.getLocalCoords(x, y)
    return chunk.terrainData[localX][localY]
  }

  private checkAdjacentBiomes(
    x: number,
    y: number,
    requiredBiomes: string[],
    exclusiveBiomes: string[] | undefined,
    radius: number
  ): boolean {
    let foundRequired = false

    // Check all tiles in radius
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (dx === 0 && dy === 0) continue

        const { height, temp, moisture } = this.getEnvironmentConditions(
          x + dx,
          y + dy
        )
        const adjacentBiome = this.getBiomeForConditions(
          x + dx,
          y + dy,
          height,
          temp,
          moisture,
          false
        )

        if (!adjacentBiome) continue

        // If we're checking exclusive biomes, ANY non-matching biome fails the check
        if (exclusiveBiomes) {
          if (!exclusiveBiomes.includes(adjacentBiome.biome.name)) {
            return false
          }
        }

        // For regular adjacent check, ANY matching biome passes
        if (requiredBiomes.includes(adjacentBiome.biome.name)) {
          foundRequired = true
        }
      }
    }

    // If exclusive check passed (didn't return false) and we either
    // found a required biome or weren't looking for one, return true
    return foundRequired || !requiredBiomes.length
  }

  private getBiomeForConditions(
    x: number,
    y: number,
    height: number,
    temp: number,
    moisture: number,
    checkAdjacency: boolean = true
  ) {
    const validBiomes = this.biomeSystems.filter(({ biome }) => {
      const { conditions } = biome

      // Basic condition checks
      const basicConditionsMet =
        (!conditions.minHeight || height >= conditions.minHeight) &&
        (!conditions.maxHeight || height <= conditions.maxHeight) &&
        (!conditions.minTemp || temp >= conditions.minTemp) &&
        (!conditions.maxTemp || temp <= conditions.maxTemp) &&
        (!conditions.minMoisture || moisture >= conditions.minMoisture) &&
        (!conditions.maxMoisture || moisture <= conditions.maxMoisture)

      if (!basicConditionsMet) return false

      // Adjacency checks

      if (checkAdjacency) {
        if ((conditions.requiresExclusiveAdjacent?.length ?? 0) > 0) {
          // Must ONLY be next to these biomes
          if (
            !this.checkAdjacentBiomes(
              x,
              y,
              [], // no required biomes
              conditions.requiresExclusiveAdjacent,
              conditions.searchRadius ?? 3
            )
          ) {
            return false
          }
        }

        if ((conditions.requiresAdjacent?.length ?? 0) > 0) {
          // Must be next to AT LEAST ONE of these biomes
          if (
            !this.checkAdjacentBiomes(
              x,
              y,
              conditions.requiresAdjacent ?? [],
              undefined, // no exclusive check
              conditions.searchRadius ?? 3
            )
          ) {
            return false
          }
        }
      }

      return true
    })

    if (validBiomes.length === 0) {
      return this.biomeSystems.find(({ biome }) => biome.name === 'Plains')!
    }

    return validBiomes[0]
  }
}
