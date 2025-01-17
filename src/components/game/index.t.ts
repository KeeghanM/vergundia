export enum Requirement {
  BOAT = 'boat',
  CLIMB = 'climb',
  FLY = 'fly',
  SWIM = 'swim',
  KEY = 'key',
  CUT = 'cut',
}

export enum PlayerCondition {
  POISONED = 'poisoned',
  BURNED = 'burned',
  FROZEN = 'frozen',
  SLEEPING = 'sleeping',
  CONFUSED = 'confused',
  TIRED = 'tired',
  EXHAUSTED = 'exhausted',
  HUNGRY = 'hungry',
  STARVING = 'starving',
  THIRSTY = 'thirsty',
  DEHYDRATED = 'dehydrated',
}

export type Terrain = {
  type: string
  label: string
  color: string
  difficulty: number
  requirements?: Requirement[]
}

export type BiomeTerrainMap = {
  [key: string]: Terrain
}

export type BiomeConfig = {
  terrainScale: number
  smallFeatureScale: number
  smallFeatureInfluence: number
}
export type BiomeConditions = {
  minTemp?: number
  maxTemp?: number
  minMoisture?: number
  maxMoisture?: number
  minHeight?: number
  maxHeight?: number
  requiresAdjacent?: string[]
  requiresExclusiveAdjacent?: string[]
  searchRadius?: number
}

export type Biome = {
  name: string
  terrainTypes: BiomeTerrainMap
  config: BiomeConfig
  conditions: BiomeConditions
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
  canvasSelector: string
  uiSelector: string
  width: number
  height: number
}
export type ChunkCache = {
  terrainData: Array<
    Array<{
      terrain: Terrain
      biomeName: string
    }>
  >
}

export type Button = {
  label: string
  function?: () => void
}
