// player.ts
import type { Canvas } from '../../../lib/canvas'
import type { EventSystem } from '../../../lib/eventSystem'
import type { ServiceContainer } from '../../../lib/serviceContainer'
import type { StateManager } from '../../../lib/stateManager'
import type { AbilityId } from '../dataFiles/abilities'
import type { ConditionId } from '../dataFiles/conditions'
import type { Terrain, Requirement, Position } from '../index.t'
import { GameEvents } from '../index.t'
import { World } from '../world'
import { Entity } from './entity'

export class Player extends Entity {
  private readonly BASE_MOVE_COST = 1
  private readonly BASE_XP = 1000 // Level 1 XP requirement
  private readonly LEVEL_MULTIPLIER = 1.4
  private position: Position
  private xp: number
  private warned: boolean
  private requirements: Set<Requirement>

  constructor(container: ServiceContainer) {
    super(container, {
      damageMultiplier: 1,
      energy: {
        current: 100,
        max: 100,
      },
      health: {
        current: 100,
        max: 100,
      },
      healthRegen: 1,
      invisible: false,
    })
    this.position = { x: 0, y: 0 }
    this.xp = 0
    this.warned = false

    // Add starting abilities
    this.addAbility('basic_attack')

    // Add starting requirements
    this.requirements = new Set()
  }

  getId(): string {
    return 'player'
  }

  move(dx: number, dy: number) {
    const state = this.container.get<StateManager>('state')
    const events = this.container.get<EventSystem>('events')

    const newX = this.position.x + dx
    const newY = this.position.y + dy

    // Check if movement is possible
    if (!this.canMove(dx, dy)) return

    // Update position
    this.position = { x: newX, y: newY }
    state.updatePlayerPosition(newX, newY)

    // Calculate energy cost
    const world = this.container.get<World>('world')
    const terrain = world.getTerrain(newX, newY).terrain
    const energyCost = this.calculateMoveCost(terrain)
    const newEnergy = this.stats.energy.current - energyCost

    this.modifyStat('energy', -energyCost)
    state.updatePlayerStats({
      energy: newEnergy,
      position: { x: newX, y: newY },
    })

    // Emit move event
    events.emit(GameEvents.PLAYER_MOVE, { x: newX, y: newY })

    // Check for exhaustion effects
    if (newEnergy < 0) {
      this.checkExhaustionEffects()
    }
  }

  canMove(dx: number, dy: number): boolean {
    const state = this.container.get<StateManager>('state')
    const events = this.container.get<EventSystem>('events')

    const world = this.container.get<World>('world')
    const terrain = world.getTerrain(
      this.position.x + dx,
      this.position.y + dy
    ).terrain

    // Check for movement-preventing conditions
    if (this.hasCondition('frozen') || this.hasCondition('sleeping')) {
      return false
    }

    // Check energy requirements
    const energyCost = this.calculateMoveCost(terrain)
    if (this.stats.energy.current - energyCost < 0 && !this.warned) {
      events.emit(GameEvents.WINDOW_OPEN, {
        buttons: [
          {
            function: () => {
              this.warned = true
              state.updatePlayerStats({ warned: true })
              this.move(dx, dy)
            },
            label: 'Continue',
          },
          { label: 'Stop' },
        ],
        content: [
          "You're low on energy! If you keep moving through the world, you'll risk serious consequences!",
        ],
        title: 'Continue to move?',
      })
      return false
    }

    // Check terrain requirements
    if (terrain.requirements) {
      for (const requirement of terrain.requirements) {
        if (!this.requirements.has(requirement)) {
          return false
        }
      }
    }

    return true
  }

  private calculateMoveCost(terrain: Terrain | null): number {
    return this.BASE_MOVE_COST * (terrain?.difficulty ?? 1)
  }

  private checkExhaustionEffects() {
    const events = this.container.get<EventSystem>('events')

    const isTired = this.hasCondition('tired')
    const isExhausted = this.hasCondition('exhausted')
    const isConfused = this.hasCondition('confused')

    const badThingChance = isConfused
      ? 1
      : isExhausted
      ? 0.7
      : isTired
      ? 0.3
      : 0.1

    if (Math.random() < badThingChance) {
      let newCondition: ConditionId | null = null
      if (!isTired) newCondition = 'tired'
      else if (isTired && !isExhausted) newCondition = 'exhausted'
      else if (isExhausted && !isConfused) newCondition = 'confused'

      const damage = Math.round(20 * badThingChance)

      // Update state
      if (newCondition) {
        this.addCondition(newCondition, {
          duration: 5,
          source: this.getId(),
          stacks: 1,
        })
      }
      this.modifyStat('health', -damage)

      // Show message
      events.emit(GameEvents.WINDOW_OPEN, {
        buttons: [{ label: 'Ok' }],
        content: [
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
            newCondition
              ? `You have also gained the ${newCondition} condition!`
              : ''
          } Make sure you rest soon.`,
        ],
        title: 'Ouch!',
      })
    }
  }

  rest() {
    const state = this.container.get<StateManager>('state')
    const events = this.container.get<EventSystem>('events')

    events.emit(GameEvents.WINDOW_OPEN, {
      buttons: [
        {
          function: () => {
            this.stats.energy.current = this.stats.energy.max
            this.stats.health.current = this.stats.health.max
            this.warned = false
            this.conditions.clear()

            state.updatePlayerStats({
              conditions: new Set(),
              energy: this.stats.energy.max,
              health: this.stats.health.max,
              warned: false,
            })
            events.emit(GameEvents.WINDOW_CLOSE)
          },
          label: 'Yes',
        },
        {
          function: () => events.emit(GameEvents.WINDOW_CLOSE),
          label: 'No',
        },
      ],
      content: ['Would you like to rest and recover?'],
      title: 'Rest now?',
    })
  }

  getLevel(): number {
    return (
      Math.floor(
        Math.log(1 + (this.xp * (this.LEVEL_MULTIPLIER - 1)) / this.BASE_XP) /
          Math.log(this.LEVEL_MULTIPLIER)
      ) + 1
    )
  }

  showConditions(): string {
    return Array.from(this.conditions.keys()).join(' | ')
  }

  openInventory() {
    const events = this.container.get<EventSystem>('events')
    events.emit(GameEvents.WINDOW_OPEN, {
      buttons: [{ label: 'Close' }],
      content: ['Your inventory is empty.'], // TODO: Implement inventory system
      title: 'Inventory',
    })
  }

  search() {
    const events = this.container.get<EventSystem>('events')
    events.emit(GameEvents.WINDOW_OPEN, {
      buttons: [{ label: 'Close' }],
      content: ['You search the area but find nothing of interest.'],
      title: 'Search',
    })
  }

  addXP(amount: number) {
    this.xp += amount
    const state = this.container.get<StateManager>('state')
    state.updatePlayerStats({ xp: this.xp })
  }

  getXP(): number {
    return this.xp
  }

  addAbility(ability: AbilityId) {
    super.addAbility(ability)
    const state = this.container.get<StateManager>('state')
    state.updatePlayerStats({
      abilities: new Set([...this.abilities]),
    })
  }

  draw(canvas: Canvas, centerX: number, centerY: number) {
    canvas.setColor('red')
    canvas.text('@', centerX, centerY)
  }
}
