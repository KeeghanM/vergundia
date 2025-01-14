import {
  binarySearchThreshold,
  type ThresholdItem,
} from '../../lib/binarySearch'
import type { Biome, BiomeMap, WorldConfig } from './index.t'
import { NoiseGenerator } from '../../lib/noiseGenerator'
import { TerrainSystem } from './terrainSystem'

export class World {
  private biomeSystems: ThresholdItem<{
    biome: Biome
    terrainSystem: TerrainSystem
  }>[]
  private terrainNoise: NoiseGenerator
  private terrainDetailNoise: NoiseGenerator
  private biomeNoise: NoiseGenerator
  private biomeDetailNoise: NoiseGenerator
  private baseTerrainScale: number

  constructor(biomes: BiomeMap, config: WorldConfig) {
    const {
      baseTerrainScale = 0.08,
      biomeScale = 0.001,
      biomeFineScale = 0.01,
      biomeFineInfluence = 0.2,
    } = config

    this.baseTerrainScale = baseTerrainScale

    // Initialize noise generators
    this.terrainNoise = new NoiseGenerator({ scale: baseTerrainScale })
    this.terrainDetailNoise = new NoiseGenerator({
      scale: baseTerrainScale * 2,
      influence: 0.5,
    })
    this.biomeNoise = new NoiseGenerator({ scale: biomeScale })
    this.biomeDetailNoise = new NoiseGenerator({
      scale: biomeFineScale,
      influence: biomeFineInfluence,
    })

    // Initialize biome systems
    this.biomeSystems = Object.entries(biomes)
      .map(([threshold, biome]) => ({
        threshold: parseFloat(threshold),
        value: {
          biome,
          terrainSystem: new TerrainSystem(biome.terrainTypes),
        },
      }))
      .sort((a, b) => a.threshold - b.threshold)
  }

  getTerrain(x: number, y: number) {
    // Get biome
    const biomeValue =
      this.biomeNoise.getValue(x, y) + this.biomeDetailNoise.getValue(x, y)
    const { biome, terrainSystem } = binarySearchThreshold(
      this.biomeSystems,
      biomeValue
    )

    // Get terrain scales for this biome
    const scaleRatio =
      (biome.config?.terrainScale ?? this.baseTerrainScale) /
      this.baseTerrainScale
    const detailInfluence = biome.config?.smallFeatureInfluence ?? 0.5

    // Use existing noise generators but adjust for biome-specific scale
    const terrainValue =
      this.terrainNoise.getValue(x * scaleRatio, y * scaleRatio) +
      this.terrainDetailNoise.getValue(x * scaleRatio, y * scaleRatio) *
        (detailInfluence / this.terrainDetailNoise.influence)

    return {
      terrain: terrainSystem.getTerrainForValue(terrainValue),
      biomeName: biome.name,
    }
  }
}
