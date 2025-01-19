import type { Entity } from '../entity/entity'
import type { ConditionId } from './conditions'

type BaseEffect = {
  name: string
  description: string
}

type InstantEffect = BaseEffect & {
  type: 'instant'
  action: (target: Entity) => void
}

type ConditionEffect = BaseEffect & {
  type: 'condition'
  condition: ConditionId
  duration: number
}

type StatusEffect = BaseEffect & {
  type: 'status'
  modifiers: {
    [stat: string]: number | boolean
  }
  duration: number
}

export type Effect = InstantEffect | ConditionEffect | StatusEffect

export const EFFECTS = {
  damage_increase: {
    description: 'Increases damage dealt by 50%',
    duration: 3,
    modifiers: {
      damageMultiplier: 1.5,
    },
    name: 'Damage Increase',
    type: 'status',
  },
  health_regeneration: {
    description: 'Regenerates health over time',
    duration: 5,
    modifiers: {
      healthRegen: 5,
    },
    name: 'Health Regeneration',
    type: 'status',
  },

  invisible: {
    description: 'The user is invisible in darkness',
    duration: 5,
    modifiers: {
      invisible: true,
    },
    name: 'Invisible in Darkness',
    type: 'status',
  },

  knockback: {
    action: (target: Entity) => {
      // Implementation of knockback logic
    },
    description: 'The target is pushed away from the attacker',
    name: 'Knockback',
    type: 'instant',
  },

  life_drain: {
    action: (target: Entity) => {
      target.modifyStat('health', -20)
      // Would need source entity for healing
    },
    description: 'The target loses health and the attacker gains health',
    name: 'Life Drain',
    type: 'instant',
  },

  poison: {
    condition: 'poisoned',
    description: 'The target is poisoned and will take damage over time',
    duration: 5,
    name: 'Poison',
    type: 'condition',
  },
  pull: {
    action: (target: Entity) => {
      // Implementation of pull logic
    },
    description: 'The target is pulled towards the attacker',
    name: 'Pull',
    type: 'instant',
  },
  sleep: {
    condition: 'sleeping',
    description: 'The target falls asleep and cannot act',
    duration: 3,
    name: 'Sleep',
    type: 'condition',
  },
} as const satisfies Record<string, Effect>

export type EffectId = keyof typeof EFFECTS
