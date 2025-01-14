import type { Biome, BiomeConfig } from './index.t'
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

  constructor() {
    // Initialize noise generators without scales - we'll apply scales when sampling
    this.heightNoise = new NoiseGenerator({ scale: 0.008 })
    this.heightDetailNoise = new NoiseGenerator({ scale: 2, influence: 0.8 })
    this.temperatureNoise = new NoiseGenerator({
      scale: 0.05,
    })
    this.moistureNoise = new NoiseGenerator({ scale: 0.5 })

    this.biomeSystems = Object.values(biomes).map((biome) => ({
      biome,
      terrainSystem: new TerrainSystem(biome.terrainTypes),
    }))
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
    // First get environment conditions using default scales (for biome selection)
    const { height, temp, moisture } = this.getEnvironmentConditions(x, y)
    const { biome, terrainSystem } = this.getBiomeForConditions(
      x,
      y,
      height,
      temp,
      moisture
    )

    // Then get terrain value using biome-specific scales
    const terrainValue = this.getTerrainValue(x, y, biome.config)

    return {
      terrain: terrainSystem.getTerrainForValue(terrainValue),
      biomeName: biome.name,
      debugInfo: { height, temp, moisture },
    }
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
