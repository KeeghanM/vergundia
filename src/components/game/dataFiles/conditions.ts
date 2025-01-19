import type { Entity } from '../entity/entity'

export type Condition = {
  name: string
  description: string
  type: 'physical' | 'mental' | 'environmental'
  onTick?: (entity: Entity) => void
  onApply?: (entity: Entity) => void
  onRemove?: (entity: Entity) => void
  canStack: boolean
  maxStacks?: number
}

export const CONDITIONS: Record<string, Condition> = {
  bleeding: {
    canStack: true,
    description: 'Taking damage over time from bleeding',
    maxStacks: 3,
    name: 'Bleeding',
    onTick: (entity: Entity) => {
      const stacks = entity.getConditionStacks('bleeding')
      entity.modifyStat('health', -5 * stacks)
    },
    type: 'physical',
  },
  burned: {
    canStack: true,
    description: 'Taking damage over time from fire',
    maxStacks: 3,
    name: 'Burned',
    onTick: (entity: Entity) => {
      const stacks = entity.getConditionStacks('burned')
      entity.modifyStat('health', -10 * stacks)
    },
    type: 'physical',
  },
  confused: {
    canStack: false,
    description: 'Chance to fail actions',
    name: 'Confused',
    onApply: (entity: Entity) => {
      // Implement confusion logic
    },
    onRemove: (entity: Entity) => {
      // Implement confusion logic
    },
    type: 'mental',
  },
  dehydrated: {
    canStack: false,
    description: 'Taking damage over time from dehydration',
    name: 'Dehydrated',
    onTick: (entity: Entity) => {
      entity.modifyStat('health', -10)
    },
    type: 'physical',
  },

  entangled: {
    canStack: false,
    description: 'Unable to move while entangled',
    name: 'Entangled',
    onApply: (entity: Entity) => {
      // Disable movement
    },
    onRemove: (entity: Entity) => {
      // Re-enable movement
    },
    type: 'physical',
  },
  exhausted: {
    canStack: false,
    description: 'Energy regeneration reduced',
    name: 'Exhausted',
    onTick: (entity: Entity) => {
      entity.modifyStat('energy', -5)
    },
    type: 'physical',
  },
  fear: {
    canStack: false,
    description: 'Chance to fail actions',
    name: 'Fear',
    onApply: (entity: Entity) => {
      // Implement fear logic
    },
    onRemove: (entity: Entity) => {
      // Implement fear logic
    },
    type: 'mental',
  },
  frozen: {
    canStack: false,
    description: 'Unable to act while frozen',
    name: 'Frozen',
    onApply: (entity: Entity) => {
      // Disable actions
    },
    onRemove: (entity: Entity) => {
      // Re-enable actions
    },
    type: 'physical',
  },
  hungry: {
    canStack: false,
    description: 'Taking damage over time from hunger',
    name: 'Hungry',
    onTick: (entity: Entity) => {
      entity.modifyStat('health', -2)
    },
    type: 'physical',
  },
  nauseated: {
    canStack: false,
    description: 'Chance to fail actions',
    name: 'Nauseated',
    onApply: (entity: Entity) => {
      // Implement nausea logic
    },
    onRemove: (entity: Entity) => {
      // Implement nausea logic
    },
    type: 'physical',
  },
  poisoned: {
    canStack: true,
    description: 'Taking damage over time from poison',
    maxStacks: 3,
    name: 'Poisoned',
    onTick: (entity: Entity) => {
      const stacks = entity.getConditionStacks('poisoned')
      entity.modifyStat('health', -5 * stacks)
    },
    type: 'physical',
  },
  prone: {
    canStack: false,
    description: 'Unable to move while prone',
    name: 'Prone',
    onApply: (entity: Entity) => {
      // Disable movement
    },
    onRemove: (entity: Entity) => {
      // Re-enable movement
    },
    type: 'physical',
  },
  sleeping: {
    canStack: false,
    description: 'Unable to act while asleep',
    name: 'Sleeping',
    onApply: (entity: Entity) => {
      // Disable actions
    },
    onRemove: (entity: Entity) => {
      // Re-enable actions
    },
    type: 'mental',
  },
  starving: {
    canStack: false,
    description: 'Taking damage over time from starvation',
    name: 'Starving',
    onTick: (entity: Entity) => {
      entity.modifyStat('health', -10)
    },
    type: 'physical',
  },
  stunned: {
    canStack: false,
    description: 'Unable to act while stunned',
    name: 'Stunned',
    onApply: (entity: Entity) => {
      // Disable actions
    },
    onRemove: (entity: Entity) => {
      // Re-enable actions
    },
    type: 'physical',
  },
  suppressed: {
    canStack: false,
    description: 'Unable to act while suppressed',
    name: 'Suppressed',
    onApply: (entity: Entity) => {
      // Disable actions
    },
    onRemove: (entity: Entity) => {
      // Re-enable actions
    },
    type: 'physical',
  },
  thirsty: {
    canStack: false,
    description: 'Taking damage over time from thirst',
    name: 'Thirsty',
    onTick: (entity: Entity) => {
      entity.modifyStat('health', -5)
    },
    type: 'physical',
  },
  tired: {
    canStack: true,
    description: 'Energy regeneration reduced',
    maxStacks: 3,
    name: 'Tired',
    onTick: (entity: Entity) => {
      const stacks = entity.getConditionStacks('tired')
      entity.modifyStat('energy', -1 * stacks)
    },
    type: 'physical',
  },
} as const

export type ConditionId = keyof typeof CONDITIONS
