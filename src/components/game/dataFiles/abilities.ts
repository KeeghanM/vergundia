import type { ConditionId } from './conditions'
import { EFFECTS, type Effect } from './effects'

export type Ability = {
  name: string
  description: string
  cooldown: number
  energyCost: number
  damage?: number
  conditions?: {
    condition: ConditionId
    duration: number
    target: 'self' | 'enemy' | 'area'
  }[]
  effects?: {
    effect: Effect
    chance?: number
    target: 'self' | 'enemy' | 'area'
  }[]
  target: 'self' | 'enemy' | 'area'
}

export const ABILITIES: Record<string, Ability> = {
  absorb_flesh: {
    cooldown: 5,
    damage: 50,
    description: 'Absorbs the flesh of the target, healing the user',
    effects: [
      {
        effect: EFFECTS.life_drain,
        target: 'enemy',
      },
    ],
    energyCost: 25,
    name: 'Absorb Flesh',
    target: 'enemy',
  },

  basic_attack: {
    cooldown: 0,
    damage: 10,
    description: 'A basic attack with your weapon',
    energyCost: 5,
    name: 'Basic Attack',
    target: 'enemy',
  },

  bite: {
    conditions: [
      {
        condition: 'bleeding',
        duration: 3,
        target: 'enemy',
      },
    ],
    cooldown: 5,
    damage: 40,
    description: 'A vicious bite attack that causes bleeding',
    energyCost: 25,
    name: 'Spine Bite',
    target: 'enemy',
  },

  bone_embrace: {
    conditions: [
      {
        condition: 'suppressed',
        duration: 3,
        target: 'enemy',
      },
    ],
    cooldown: 5,
    damage: 80,
    description: 'Embraces the target in a bone prison',
    energyCost: 35,
    name: 'Bone Embrace',
    target: 'enemy',
  },

  bone_shot: {
    cooldown: 2,
    damage: 20,
    description: 'Fires a bone shard at the target',
    energyCost: 10,
    name: 'Bone Shot',
    target: 'area',
  },

  constrict: {
    conditions: [
      {
        condition: 'entangled',
        duration: 3,
        target: 'enemy',
      },
    ],
    cooldown: 4,
    damage: 30,
    description: 'Constricts the target, dealing damage over time',
    energyCost: 20,
    name: 'Constrict',
    target: 'enemy',
  },

  death_shroud: {
    cooldown: 4,
    damage: 50,
    description: 'A dark fog descends on the area',
    energyCost: 20,
    name: 'Death Shroud',
    target: 'area',
  },

  fear_reflection: {
    conditions: [
      {
        condition: 'fear',
        duration: 3,
        target: 'enemy',
      },
    ],
    cooldown: 5,
    damage: 50,
    description: 'Reflects fear back at the target',
    energyCost: 20,
    name: 'Fear Reflection',
    target: 'enemy',
  },

  feral_rage: {
    cooldown: 5,
    description: 'The user goes into a feral rage, increasing damage',
    effects: [
      {
        effect: EFFECTS.damage_increase,
        target: 'self',
      },
    ],
    energyCost: 20,
    name: 'Feral Rage',
    target: 'self',
  },

  haunting_whistle: {
    conditions: [
      {
        condition: 'fear',
        duration: 3,
        target: 'enemy',
      },
    ],
    cooldown: 3,
    description: 'A haunting whistle that causes terror in the target',
    energyCost: 10,
    name: 'Haunting Whistle',
    target: 'enemy',
  },

  horn_charge: {
    cooldown: 5,
    damage: 35,
    description: 'Charges directly at you with its horns',
    effects: [
      {
        effect: EFFECTS.knockback,
        target: 'enemy',
      },
    ],
    energyCost: 25,
    name: 'Horn Charge',
    target: 'enemy',
  },

  lullaby: {
    cooldown: 5,
    description: 'Sings a lullaby that puts the target to sleep',
    effects: [
      {
        effect: EFFECTS.sleep,
        target: 'enemy',
      },
    ],
    energyCost: 25,
    name: 'Lullaby',
    target: 'enemy',
  },

  night_stalker: {
    cooldown: 5,
    description: 'The user becomes invisible',
    effects: [
      {
        effect: EFFECTS.invisible,
        target: 'self',
      },
    ],
    energyCost: 20,
    name: 'Night Stalker',
    target: 'self',
  },

  root_growth: {
    cooldown: 5,
    description: 'Roots sprout out and bury into the ground, healing the user',
    effects: [
      {
        effect: EFFECTS.health_regeneration,
        target: 'self',
      },
    ],
    energyCost: 20,
    name: 'Root Growth',
    target: 'self',
  },

  shadow_bite: {
    cooldown: 3,
    damage: 25,
    description: 'A shadowy bite that drains life from the target',
    effects: [
      {
        effect: EFFECTS.life_drain,
        target: 'enemy',
      },
    ],
    energyCost: 15,
    name: 'Shadow Bite',
    target: 'enemy',
  },

  shard_storm: {
    cooldown: 5,
    damage: 50,
    description: 'Summons a storm of sharp mirror shards',
    energyCost: 25,
    name: 'Shard Storm',
    target: 'area',
  },

  shriek: {
    conditions: [
      {
        condition: 'nauseated',
        duration: 3,
        target: 'enemy',
      },
    ],
    cooldown: 3,
    damage: 15,
    description: 'A piercing shriek that causes nausea in the target',
    energyCost: 15,
    name: 'Shriek',
    target: 'enemy',
  },

  soul_rend: {
    cooldown: 5,
    damage: 100,
    description: "Rips chunks from the target's soul",
    energyCost: 25,
    name: 'Soul Rend',
    target: 'enemy',
  },

  spike_launch: {
    cooldown: 4,
    damage: 30,
    description: 'Launches a barrage of spikes at the target',
    energyCost: 20,
    name: 'Spike Launch',
    target: 'enemy',
  },

  tendril_grasp: {
    cooldown: 4,
    damage: 30,
    description: 'Grasps the target with tendrils, pulling them closer',
    effects: [
      {
        effect: EFFECTS.pull,
        target: 'enemy',
      },
    ],
    energyCost: 20,
    name: 'Tendril Grasp',
    target: 'enemy',
  },

  tremor_stomp: {
    conditions: [
      {
        condition: 'prone',
        duration: 1,
        target: 'enemy',
      },
      {
        condition: 'stunned',
        duration: 1,
        target: 'enemy',
      },
    ],
    cooldown: 4,
    damage: 30,
    description: 'Stomps the ground, causing a shockwave that knocks you over',
    energyCost: 20,
    name: 'Tremor Stomp',
    target: 'enemy',
  },

  vine_whip: {
    conditions: [{ condition: 'entangled', duration: 3, target: 'enemy' }],
    cooldown: 3,
    damage: 25,
    description: 'A powerful whip attack using vines',
    energyCost: 15,
    name: 'Vine Whip',
    target: 'enemy',
  },

  void_step: {
    cooldown: 5,
    description: 'The user steps into the void, teleporting to a new location',
    energyCost: 20,
    name: 'Void Step',
    target: 'self',
  },
} as const

export type AbilityId = keyof typeof ABILITIES
