import type { Biome, BiomeConfig, ChunkCache } from './index.t'
import { NoiseGenerator } from '../../lib/noiseGenerator'
import { TerrainSystem } from './terrainSystem'
import { biomes } from './dataFiles/biomes'

export class World {
  private biomeSystems: {
    biome: Biome
    terrainSystem: TerrainSystem
  }[]
  private heightNoise: NoiseGenerator
  private heightDetailNoise: NoiseGenerator
  private temperatureNoise: NoiseGenerator
  private moistureNoise: NoiseGenerator

  // Caching
  private readonly CHUNK_SIZE = 32 // Must be power of 2 for bit operations
  private readonly CHUNK_MASK = this.CHUNK_SIZE - 1 // For fast modulo
  private chunks: Map<string, ChunkCache>

  constructor() {
    // Initialize noise generators without scales
    // Make base height variations much more gradual for continent-like features
    this.heightNoise = new NoiseGenerator({ scale: 0.002 })

    // Increase detail noise to create more interesting local variations
    // But keep influence low to avoid breaking up the large features
    this.heightDetailNoise = new NoiseGenerator({ scale: 0.1, influence: 0.5 })

    // Make temperature and moisture even more gradual to create larger climate zones
    this.temperatureNoise = new NoiseGenerator({ scale: 0.01 })
    this.moistureNoise = new NoiseGenerator({ scale: 0.015 })
    this.biomeSystems = Object.values(biomes).map((biome) => ({
      biome,
      terrainSystem: new TerrainSystem(biome.terrainTypes),
    }))

    this.chunks = new Map()
  }

  private getChunkKey(x: number, y: number): string {
    // Faster than string concatenation with template literals
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
    const temp = this.normalizeTerrain(this.temperatureNoise.getValue(x, y))
    const moisture = this.normalizeTerrain(this.moistureNoise.getValue(x, y))

    // Height now uses default scales for biome selection
    const baseHeight = this.heightNoise.getValue(x, y)
    const detailHeight = this.heightDetailNoise.getValue(x, y) * 0.5

    const height = this.normalizeTerrain(baseHeight + detailHeight)

    return { height, temp, moisture }
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
          terrain: terrainSystem.getTerrainForValue(terrainValue),
          biomeName: biome.name,
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
    radius: number
  ): boolean {
    // Check in a square around the point for required biomes
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (dx === 0 && dy === 0) continue // Skip self

        // Get biome at this adjacent point
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

        if (
          adjacentBiome &&
          requiredBiomes.includes(adjacentBiome.biome.name)
        ) {
          return true
        }
      }
    }
    return false
  }

  private getBiomeForConditions(
    x: number,
    y: number,
    height: number,
    temp: number,
    moisture: number,
    checkAdjacency: boolean = true
  ) {
    // Find all valid biomes for these conditions
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

      // Check adjacency requirements if needed
      if (
        checkAdjacency &&
        conditions.requiresAdjacent &&
        conditions.requiresAdjacent.length > 0
      ) {
        return this.checkAdjacentBiomes(
          x,
          y,
          conditions.requiresAdjacent,
          conditions.searchRadius ?? 3
        )
      }

      return true
    })

    if (validBiomes.length === 0) {
      return this.biomeSystems.find(({ biome }) => biome.name === 'Plains')!
    }

    return validBiomes[0]
  }
}
