import {
  binarySearchThreshold,
  type ThresholdItem,
} from '../../lib/binarySearch'
import type { BiomeTerrainMap, Terrain } from './index.t'

export class TerrainSystem {
  private sortedTerrains: ThresholdItem<Terrain>[]

  constructor(terrainTypes: BiomeTerrainMap) {
    this.sortedTerrains = Object.entries(terrainTypes)
      .map(([threshold, terrain]) => ({
        threshold: parseFloat(threshold),
        value: terrain,
      }))
      .sort((a, b) => a.threshold - b.threshold)
  }

  getTerrainForValue(value: number): Terrain {
    return binarySearchThreshold(this.sortedTerrains, value)
  }
}
