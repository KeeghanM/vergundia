import type { Canvas } from '../../lib/canvas'
import type { Requirement, Terrain } from './index.t'
import type { World } from './world'

export class Player {
  public x: number
  public y: number
  public abilities: Set<Requirement>
  public conditions: Set<string>
  public currentTerrain: Terrain | null
  public currentBiome: string | null

  public energy = 100
  public maxEnergy = 100
  public health = 100
  public maxHealth = 100

  private color: string
  private symbol: string

  private movingTo: Terrain | null
  private readonly moveCost = 1 // equivalent to Miles/tile

  constructor() {
    this.x = 0
    this.y = 0
    this.color = 'red'
    this.symbol = '@'
    this.abilities = new Set()
    this.currentTerrain = null
    this.currentBiome = null
    this.conditions = new Set()
    this.movingTo = null
  }

  draw(canvas: Canvas, centerX: number, centerY: number) {
    canvas.setColor(this.color)
    canvas.text(this.symbol, centerX, centerY)
  }

  getPosition() {
    return { x: this.x, y: this.y }
  }

  move(dx: number, dy: number) {
    this.x += dx
    this.y += dy

    this.energy -= this.moveCost * (this.movingTo?.difficulty ?? 0)
    this.energy = Math.max(this.energy, 0)
  }

  canMove(dx: number, dy: number, world: World) {
    const x = this.x + dx
    const y = this.y + dy
    const terrain = world.getTerrain(x, y).terrain

    if (this.energy - this.moveCost * (this.movingTo?.difficulty ?? 0) < 0)
      return false

    if (terrain.requirements) {
      for (const requirement of terrain.requirements) {
        if (!this.abilities.has(requirement)) {
          return false
        }
      }
    }

    this.movingTo = terrain
    return true
  }

  inventory() {}

  rest() {
    this.energy = this.maxEnergy
  }

  search() {}
}
