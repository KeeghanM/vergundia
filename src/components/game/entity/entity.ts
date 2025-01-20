import type { ServiceContainer } from '../../../lib/serviceContainer'
import { ABILITIES, type AbilityId } from '../dataFiles/abilities'
import { CONDITIONS, type ConditionId } from '../dataFiles/conditions'
import type { Effect } from '../dataFiles/effects'

type EntityStats = {
  health: {
    max: number
    current: number
  }
  energy: {
    max: number
    current: number
  }
  damageMultiplier: number
  healthRegen: number
  invisible: boolean
}

type ConditionState = {
  stacks: number
  duration: number
  source: string // EntityId
}

type CooldownState = {
  remainingTurns: number
}

export abstract class Entity {
  protected container: ServiceContainer
  protected stats: EntityStats
  protected conditions: Map<ConditionId, ConditionState>
  protected cooldowns: Map<AbilityId, CooldownState>
  protected abilities: Set<AbilityId>

  constructor(container: ServiceContainer, initialStats: EntityStats) {
    this.container = container
    this.stats = initialStats
    this.conditions = new Map()
    this.cooldowns = new Map()
    this.abilities = new Set()
  }

  // Stat management
  getStats(): Readonly<EntityStats> {
    return { ...this.stats }
  }

  modifyStat(stat: keyof EntityStats, value: number | boolean) {
    const current = this.stats[stat]
    if (typeof current !== 'object') {
      // basic stat
      if (typeof value === 'number') {
        this.stats[stat] += value
      } else if (typeof value === 'boolean') {
        this.stats[stat] = value
      }
    } else {
      // object stat
      if (typeof value === 'number') {
        const newVal = Math.min(
          Math.max((this.stats[stat].current += value), 0),
          this.stats[stat].max
        )
        this.stats[stat].current = newVal
      } else if (typeof value === 'boolean') {
        this.stats[stat] = value
      }
    }
  }

  // Condition Management
  hasCondition(condition: ConditionId): boolean {
    return this.conditions.has(condition)
  }

  getConditionStacks(condition: ConditionId): number {
    return this.conditions.get(condition)?.stacks ?? 0
  }

  addCondition(condition: ConditionId, details: ConditionState) {
    const existing = this.conditions.get(condition)
    if (existing) {
      // Update existing condition
      existing.duration = Math.max(existing.duration, details.duration)
      existing.stacks = Math.min(
        existing.stacks + details.stacks,
        CONDITIONS[condition].maxStacks ?? Infinity
      )
    } else {
      // Apply new condition
      this.conditions.set(condition, details)
      CONDITIONS[condition].onApply?.(this)
    }
  }

  removeCondition(condition: ConditionId) {
    if (this.conditions.has(condition)) {
      CONDITIONS[condition].onRemove?.(this)
      this.conditions.delete(condition)
    }
  }

  // Effect handling
  applyEffect(effect: Effect, source: Entity) {
    switch (effect.type) {
      case 'instant':
        effect.action(this)
        break
      case 'condition':
        this.addCondition(effect.condition, {
          duration: effect.duration,
          source: source.getId(),
          stacks: 1,
        })
        break
      case 'status':
        // Apply stat modifiers
        Object.entries(effect.modifiers).forEach(([stat, value]) => {
          this.modifyStat(stat as keyof EntityStats, value)
        })
        break
    }
  }

  // Ability management
  hasAbility(abilityId: AbilityId): boolean {
    return this.abilities.has(abilityId)
  }

  addAbility(abilityId: AbilityId) {
    this.abilities.add(abilityId)
  }

  removeAbility(abilityId: AbilityId) {
    this.abilities.delete(abilityId)
  }

  isOnCooldown(abilityId: AbilityId): boolean {
    return (this.cooldowns.get(abilityId)?.remainingTurns ?? 0) > 0
  }

  startCooldown(abilityId: AbilityId, duration: number) {
    this.cooldowns.set(abilityId, { remainingTurns: duration })
  }

  useAbility(abilityId: AbilityId, target: Entity) {
    const ability = ABILITIES[abilityId]
    if (!ability || !this.hasAbility(abilityId)) return false
    if (this.isOnCooldown(abilityId)) return false
    if (this.stats.energy.current < ability.energyCost) return false

    // Apply damage
    if (ability.damage) {
      target.modifyStat('health', -ability.damage)
    }

    // Apply conditions
    ability.conditions?.forEach((conditionEffect) => {
      target.addCondition(conditionEffect.condition, {
        duration: conditionEffect.duration,
        source: this.getId(),
        stacks: 1,
      })
    })

    // Apply effects
    ability.effects?.forEach((effectData) => {
      if (Math.random() > (effectData.chance ?? 1)) return
      const effectTarget = effectData.target === 'self' ? this : target
      effectTarget.applyEffect(effectData.effect, this)
    })

    // Apply costs
    this.modifyStat('energy', -ability.energyCost)
    this.startCooldown(abilityId, ability.cooldown)

    return true
  }

  // Turn management
  onTurnStart() {
    // Process conditions
    for (const [conditionId, state] of this.conditions.entries()) {
      const condition = CONDITIONS[conditionId]
      condition.onTick?.(this)

      state.duration--
      if (state.duration <= 0) {
        this.removeCondition(conditionId)
      }
    }

    // Process cooldowns
    for (const [abilityId, state] of this.cooldowns.entries()) {
      state.remainingTurns--
      if (state.remainingTurns <= 0) {
        this.cooldowns.delete(abilityId)
      }
    }
  }

  abstract getId(): string
}
