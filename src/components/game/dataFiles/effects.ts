export type Effect = {
  name: string
  description: string
}

export const EFFECTS = {
  bleeding: {
    description: 'The target bleeds, taking damage over time',
    name: 'Bleeding',
  },
  damage_increase: {
    description: 'The target deals increased damage',
    name: 'Damage Increase',
  },
  entangle: {
    description: 'Roots and vines wrap around the target, immobilizing them',
    name: 'Entangle',
  },
  fear: {
    description: 'The target is frightened and runs away',
    name: 'Fear',
  },
  health_regeneration: {
    description: 'The target regenerates health over time',
    name: 'Health Regeneration',
  },
  invisibility_in_darkness: {
    description: 'The target becomes invisible in darkness',
    name: 'Invisibility in Darkness',
  },
  knockback: {
    description: 'The target is pushed away from the attacker',
    name: 'Knockback',
  },
  life_drain: {
    description: 'The target loses health and the attacker gains health',
    name: 'Life Drain',
  },
  nausea: {
    description: 'The target is nauseated and has reduced accuracy',
    name: 'Nausea',
  },
  prone: {
    description: 'The target is knocked prone and must stand up',
    name: 'Prone',
  },
  pull: {
    description: 'The target is pulled towards the attacker',
    name: 'Pull',
  },
  sleep: {
    description: 'The target falls asleep and cannot act',
    name: 'Sleep',
  },
  stun: {
    description: 'The target is stunned and unable to act',
    name: 'Stun',
  },
  suppress: {
    description: 'The target is unable to use abilities',
    name: 'Suppress',
  },
  terror: {
    description: 'The target is terrified and unable to act',
    name: 'Terror',
  },
} as const satisfies Record<string, Effect>

export type EffectId = keyof typeof EFFECTS
