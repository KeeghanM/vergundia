import type { Canvas } from '../../lib/canvas'
import type { Requirement, Terrain } from './index.t'
import type { World } from './world'

export class Player {
  public x: number
  public y: number
  public abilities: Set<Requirement>
  public currentTerrain: Terrain | null
  public currentBiome: string | null

  private color: string
  private symbol: string

  constructor() {
    this.x = 0
    this.y = 0
    this.color = 'red'
    this.symbol = '@'
    this.abilities = new Set()
    this.currentTerrain = null
    this.currentBiome = null
  }

  move(dx: number, dy: number) {
    this.x += dx
    this.y += dy
  }

  draw(canvas: Canvas, centerX: number, centerY: number) {
    canvas.setColor(this.color)
    canvas.text(this.symbol, centerX, centerY)
  }

  getPosition() {
    return { x: this.x, y: this.y }
  }

  canMove(dx: number, dy: number, world: World) {
    const x = this.x + dx
    const y = this.y + dy
    const terrain = world.getTerrain(x, y).terrain

    if (terrain.requirements) {
      for (const requirement of terrain.requirements) {
        if (!this.abilities.has(requirement)) {
          return false
        }
      }
    }
    return true
  }
}
