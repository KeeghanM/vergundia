import type { Canvas } from '../../lib/canvas'
import { Window } from '../../lib/window'
import type { Game } from './game'
import {
  type Requirement,
  type Terrain,
  type PlayerCondition,
  PlayerCondition as pc,
} from './index.t'
import type { World } from './world'

export class Player {
  public x: number
  public y: number
  public abilities: Set<Requirement> = new Set()
  public conditions: Set<PlayerCondition> = new Set()
  public currentTerrain: Terrain | null
  public currentBiome: string | null

  // public inventory

  public energy = 10
  public maxEnergy = 100
  public health = 100
  public maxHealth = 100

  public xp = 0

  private color: string
  private symbol: string

  private warned = false
  private movingTo: Terrain | null
  private readonly moveCost = 1 // equivalent to Miles/tile
  private game: Game

  constructor(game: Game) {
    this.game = game
    this.x = 0
    this.y = 0
    this.color = 'red'
    this.symbol = '@'
    this.currentTerrain = null
    this.currentBiome = null
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
    if (this.energy < 0) {
      // We've moved when we shouldn't have
      const isTired = this.conditions.has(pc.TIRED)
      const isExhausted = this.conditions.has(pc.EXHAUSTED)
      const isConfused = this.conditions.has(pc.CONFUSED)

      const badThingChance = isConfused
        ? 1
        : isExhausted
        ? 0.7
        : isTired
        ? 0.3
        : 0.1
      let added: PlayerCondition | null = null
      if (Math.random() < badThingChance) {
        if (!isTired) added = pc.TIRED
        else if (isTired && !isExhausted) added = pc.EXHAUSTED
        else if (isExhausted && !isConfused) added = pc.CONFUSED

        if (added) this.conditions.add(added)

        const damage = Math.round(20 * badThingChance)

        this.health -= damage
        new Window(
          'Ouch!',
          [
            `In your ${
              isConfused
                ? 'confused'
                : isExhausted
                ? 'exhausted'
                : isTired
                ? 'tired'
                : ''
            } state you stumble and trip! You take ${damage} points of damage!`,
            `${
              added ? `You have also gained the ${added} condition!` : ''
            } Make sure you rest soon.`,
          ],
          [
            {
              label: 'Ok',
            },
          ],
          this.game
        )
      }
    }

    this.energy = Math.max(this.energy, 0)
  }

  canMove(dx: number, dy: number) {
    const x = this.x + dx
    const y = this.y + dy
    const terrain = this.game.world.getTerrain(x, y).terrain

    if (this.energy - this.moveCost * (this.movingTo?.difficulty ?? 0) < 0) {
      if (!this.warned) {
        new Window(
          'Continue to move?',
          [
            "You're low on energy! If you keep moving through the world, you'll risk serious consequences!",
          ],
          [
            {
              label: 'Continue',
              function: () => {
                this.warned = true
                this.move(dx, dy)
              },
            },
            {
              label: 'Stop',
            },
          ],
          this.game
        )
        return false
      } else {
        return true
      }
    }

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

  openInventory() {}

  rest(game: Game) {
    if (
      document.querySelectorAll('.ui_window[data-title="Rest now?"]').length > 0
    )
      return

    new Window(
      'Rest now?',
      ['Blah blah', 'rest yes or no?'],
      [
        {
          label: 'Yes',
          function: () => {
            this.energy = this.maxEnergy
            this.health = this.maxHealth
            this.warned = false
          },
        },
        { label: 'No' },
      ],
      game
    )
  }

  search() {}

  getLevel() {
    const baseXP = 1000 // Level 1 XP requirement
    const multiplier = 1.4
    return (
      Math.floor(
        Math.log(1 + (this.xp * (multiplier - 1)) / baseXP) /
          Math.log(multiplier)
      ) + 1
    )
  }

  showConditions() {
    let s = ''
    this.conditions.forEach((c) => (s += `${c} | `))
    return s
  }
}
