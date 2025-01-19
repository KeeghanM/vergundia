// player.ts
import type { Canvas } from '../../../lib/canvas'
import type { EventSystem } from '../../../lib/eventSystem'
import type { ServiceContainer } from '../../../lib/serviceContainer'
import type { StateManager } from '../../../lib/stateManager'
import type { ConditionId } from '../dataFiles/conditions'
import type { Terrain, Requirement } from '../index.t'
import { GameEvents } from '../index.t'
import { World } from '../world'

export class Player {
  private container: ServiceContainer
  private readonly BASE_MOVE_COST = 1
  private readonly BASE_XP = 1000 // Level 1 XP requirement
  private readonly LEVEL_MULTIPLIER = 1.4

  constructor(container: ServiceContainer) {
    this.container = container
  }

  move(dx: number, dy: number) {
    const state = this.container.get<StateManager>('state')
    const events = this.container.get<EventSystem>('events')
    const currentState = state.getState()
    const currentPos = currentState.player.position

    const newX = currentPos.x + dx
    const newY = currentPos.y + dy

    // Check if movement is possible
    if (!this.canMove(dx, dy)) return

    // Update position
    state.updatePlayerPosition(newX, newY)

    // Calculate energy cost
    const energyCost = this.calculateMoveCost(currentState.world.currentTerrain)
    const newEnergy = currentState.player.energy - energyCost

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
    const currentState = state.getState()
    const { x, y } = currentState.player.position

    const world = this.container.get<World>('world')
    const terrain = world.getTerrain(x + dx, y + dy).terrain

    // Check energy requirements
    const energyCost = this.calculateMoveCost(terrain)
    if (
      currentState.player.energy - energyCost < 0 &&
      !currentState.player.warned
    ) {
      events.emit(GameEvents.WINDOW_OPEN, {
        buttons: [
          {
            function: () => {
              state.updatePlayerStats({
                warned: true,
              })
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
        if (!currentState.player.abilities.has(requirement)) {
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
    const state = this.container.get<StateManager>('state')
    const events = this.container.get<EventSystem>('events')
    const currentState = state.getState()
    const { conditions } = currentState.player

    const isTired = conditions.has('tired')
    const isExhausted = conditions.has('exhausted')
    const isConfused = conditions.has('confused')

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
      const newConditions = new Set(conditions)
      if (newCondition) newConditions.add(newCondition)

      state.updatePlayerStats({
        conditions: newConditions,
        health: currentState.player.health - damage,
      })

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
            state.updatePlayerStats({
              conditions: new Set(),
              energy: state.getState().player.maxEnergy,
              health: state.getState().player.maxHealth,
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
    const state = this.container.get<StateManager>('state')
    const xp = state.getState().player.xp

    return (
      Math.floor(
        Math.log(1 + (xp * (this.LEVEL_MULTIPLIER - 1)) / this.BASE_XP) /
          Math.log(this.LEVEL_MULTIPLIER)
      ) + 1
    )
  }

  showConditions(): string {
    const state = this.container.get<StateManager>('state')
    const conditions = state.getState().player.conditions
    return Array.from(conditions).join(' | ')
  }

  openInventory() {
    const events = this.container.get<EventSystem>('events')
    events.emit(GameEvents.WINDOW_OPEN, {
      // TODO: Implement inventory system
      buttons: [{ label: 'Close' }],

      content: ['Your inventory is empty.'],
      title: 'Inventory',
    })
  }

  search() {
    // TODO: Implement search functionality
    const events = this.container.get<EventSystem>('events')
    events.emit(GameEvents.WINDOW_OPEN, {
      buttons: [{ label: 'Close' }],
      content: ['You search the area but find nothing of interest.'],
      title: 'Search',
    })
  }

  addXP(amount: number) {
    const state = this.container.get<StateManager>('state')
    const currentXP = state.getState().player.xp
    state.updatePlayerStats({ xp: currentXP + amount })
  }

  addAbility(ability: Requirement) {
    const state = this.container.get<StateManager>('state')
    const currentAbilities = state.getState().player.abilities
    state.updatePlayerStats({
      abilities: new Set([...currentAbilities, ability]),
    })
  }

  removeCondition(condition: ConditionId) {
    const state = this.container.get<StateManager>('state')
    const currentConditions = state.getState().player.conditions
    const newConditions = new Set(currentConditions)
    newConditions.delete(condition)
    state.updatePlayerStats({ conditions: newConditions })
  }

  draw(canvas: Canvas, centerX: number, centerY: number) {
    canvas.setColor('red')
    canvas.text('@', centerX, centerY)
  }
}
