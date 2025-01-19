import type { ConditionId } from './dataFiles/conditions'

export type Position = {
  x: number
  y: number
}

export type PlayerState = {
  position: Position
  health: number
  maxHealth: number
  energy: number
  maxEnergy: number
  xp: number
  conditions: Set<ConditionId>
  abilities: Set<Requirement>
  warned: boolean
}

export type WorldState = {
  currentTerrain: Terrain | null
  currentBiome: string | null
}

export type UIState = {
  windows: string[]
  isPaused: boolean
}

export type GameState = {
  player: PlayerState
  world: WorldState
  ui: UIState
}

export type Subscriber = (state: GameState) => void

export enum Requirement {
  BOAT = 'boat',
  CLIMB = 'climb',
  FLY = 'fly',
  SWIM = 'swim',
  KEY = 'key',
  CUT = 'cut',
}

export type EventMap = {
  'window:open': WindowData
  'window:close': void
  'player:move': { x: number; y: number }
  'player:damage': { amount: number }
  'player:heal': { amount: number }
  'encounter:start': void
  'encounter:end': void
}

export type GameEventKey = keyof EventMap

export enum GameEvents {
  PLAYER_MOVE = 'player:move',
  PLAYER_DAMAGE = 'player:damage',
  PLAYER_HEAL = 'player:heal',
  ENCOUNTER_START = 'encounter:start',
  ENCOUNTER_END = 'encounter:end',
  WINDOW_OPEN = 'window:open',
  WINDOW_CLOSE = 'window:close',
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

export type WindowData = {
  title: string
  content: string[]
  buttons: Button[]
}
