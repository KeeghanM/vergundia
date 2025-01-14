import type { Canvas } from '../../lib/canvas'
import type { World } from './world'

export type Terrain = {
  type: string
  label: string
  color: string
}

export type BiomeTerrainMap = {
  [key: string]: Terrain
}

type BiomeConfig = {
  terrainScale: number
  smallFeatureScale: number
  smallFeatureInfluence: number
}

export type Biome = {
  name: string
  terrainTypes: BiomeTerrainMap
  config: BiomeConfig
}

export type BiomeMap = {
  [key: string]: Biome
}
export type WorldConfig = {
  baseTerrainScale: number
  biomeScale: number
  biomeFineScale: number
  biomeFineInfluence: number
}
export type GameConfig = {
  canvas: Canvas
  world: World
  width: number
  height: number
}
