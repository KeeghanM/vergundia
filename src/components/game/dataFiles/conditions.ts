export type Condition = {
  name: string
  description: string
  duration: number
  action?: () => void
}

export const CONDITIONS = {
  burned: {
    action: () => {
      // Take damage
    },
    description: 'You are burned and will take damage over time',
    duration: 5,
    name: 'Burned',
  },
  confused: {
    action: () => {
      // May take damage
    },
    description: 'You are confused and may take damage',
    duration: 5,
    name: 'Confused',
  },
  dehydrated: {
    action: () => {
      // Take damage
    },
    description: 'You are dehydrated and will take damage',
    duration: 5,
    name: 'Dehydrated',
  },
  exhausted: {
    action: () => {
      // Take damage
    },
    description: 'You are exhausted and will take damage',
    duration: 5,
    name: 'Exhausted',
  },
  frozen: {
    action: () => {
      // Cannot move
    },
    description: 'You are frozen and cannot move',
    duration: 5,
    name: 'Frozen',
  },
  hungry: {
    action: () => {
      // May take damage
    },
    description: 'You are hungry and may take damage',
    duration: 5,
    name: 'Hungry',
  },
  poisoned: {
    action: () => {
      // Take damage
    },
    description: 'You are poisoned and will take damage over time',
    duration: 5,
    name: 'Poisoned',
  },
  sleeping: {
    action: () => {
      // Cannot move
    },
    description: 'You are asleep and cannot move',
    duration: 5,
    name: 'Sleeping',
  },
  starving: {
    action: () => {
      // Take damage
    },
    description: 'You are starving and will take damage',
    duration: 5,
    name: 'Starving',
  },
  stunned: {
    action: () => {
      // Cannot act
    },
    description: 'You are stunned and unable to act',
    duration: 5,
    name: 'Stunned',
  },
  thirsty: {
    action: () => {
      // May take damage
    },
    description: 'You are thirsty and may take damage',
    duration: 5,
    name: 'Thirsty',
  },
  tired: {
    action: () => {
      // May take damage
    },
    description: 'You are tired and may take damage',
    duration: 5,
    name: 'Tired',
  },
} as const satisfies Record<string, Condition>

export type ConditionId = keyof typeof CONDITIONS
