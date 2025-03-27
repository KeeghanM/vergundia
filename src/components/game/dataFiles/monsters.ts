import type { AbilityId } from './abilities'
import type { BiomeType } from './biomes'
import type { ItemId } from './items'

enum Size {
  small = 'small',
  medium = 'medium',
  large = 'large',
  huge = 'huge',
  variable = 'variable',
}

enum Rarity {
  common = 1,
  uncommon = 5,
  rare = 20,
  legendary = 100,
}

enum Aggression {
  defensive = 'defensive',
  aggressive = 'aggressive',
  frenzied = 'frenzied',
}

enum Intelligence {
  animal = 'animal',
  cunning = 'cunning',
  intelligent = 'intelligent',
}

enum Behavior {
  territorial = 'territorial',
  diurnal = 'diurnal',
  nocturnal = 'nocturnal',
  pack = 'pack',
  solitary = 'solitary',
}

enum DamageType {
  fire = 'fire',
  frost = 'frost',
  light = 'light',
  holy = 'holy',
  magic = 'magic',
  sonic = 'sonic',
  force = 'force',
  acid = 'acid',
  piercing = 'piercing',
  crushing = 'crushing',
  silver = 'silver',
  poison = 'poison',
  shadow = 'shadow',
  psychic = 'psychic',
  crush = 'crush',
  lightning = 'lightning',
}

export type Monster = {
  abilities: AbilityId[]
  aggression: Aggression
  baseHealth: 5 | 10 | 15 | 20
  behavior: Behavior[]
  description: string
  drops: { id: ItemId; rate: number }[]
  intelligence: Intelligence
  lore: string
  maxLevel: number
  minLevel: number
  name: string
  rarity: Rarity
  size: Size
  validBiomes: BiomeType[] // Empty array means all biomes
  weaknesses: DamageType[]
  xpValue: number
}

export const MONSTERS = {
  bone_harvester: {
    abilities: ['tendril_grasp', 'bone_shot'],
    aggression: Aggression.aggressive,
    baseHealth: 10,
    behavior: [Behavior.nocturnal, Behavior.solitary],
    description:
      'Quadrupedal creatures made of fused human bones with ribcages that open to reveal tendrils',
    drops: [
      { id: 'fused_bones', rate: 0.5 },
      { id: 'dark_tendril', rate: 0.5 },
      { id: 'dark_essence', rate: 0.5 },
    ],
    intelligence: Intelligence.cunning,
    lore: 'Created by necromancers to collect fresh materials for their experiments',
    maxLevel: 18,
    minLevel: 12,
    name: 'Bone Harvester',
    rarity: Rarity.rare,
    size: Size.large,
    validBiomes: [],
    weaknesses: [DamageType.holy, DamageType.crushing],
    xpValue: 900,
  },
  echo_stalker: {
    abilities: ['shriek'],
    aggression: Aggression.aggressive,
    baseHealth: 5,
    behavior: [Behavior.nocturnal, Behavior.pack],
    description:
      'Tall, thin humanoids covered in ear-like organs that can perfectly mimic voices',
    drops: [
      {
        id: 'echo_organ',
        rate: 0.5,
      },
      {
        id: 'dark_essence',
        rate: 0.5,
      },
      {
        id: 'absorbed_bone',
        rate: 0.5,
      },
    ],
    intelligence: Intelligence.cunning,
    lore: 'Evolved predators that use sound to hunt and deceive their prey',
    maxLevel: 14,
    minLevel: 9,
    name: 'Echo Stalker',
    rarity: Rarity.uncommon,
    size: Size.large,
    validBiomes: ['marsh', 'coast', 'forest'],
    weaknesses: [DamageType.sonic, DamageType.light],
    xpValue: 750,
  },
  flesh_sculptor: {
    abilities: ['absorb_flesh'],
    aggression: Aggression.aggressive,
    baseHealth: 10,
    behavior: [Behavior.solitary],
    description:
      'Amorphous masses of flesh and muscle that can reshape their bodies and absorb organic matter',
    drops: [
      { id: 'morphic_flesh', rate: 0.5 },
      { id: 'dark_essence', rate: 0.5 },
      { id: 'absorbed_bone', rate: 0.5 },
    ],
    intelligence: Intelligence.cunning,
    lore: 'Failed attempts at creating shapeshifting spies that escaped containment',
    maxLevel: 22,
    minLevel: 16,
    name: 'Flesh Sculptor',
    rarity: Rarity.rare,
    size: Size.variable,
    validBiomes: [],
    weaknesses: [DamageType.fire, DamageType.acid],
    xpValue: 1100,
  },
  hentra: {
    abilities: ['spike_launch', 'night_stalker'],
    aggression: Aggression.aggressive,
    baseHealth: 5,
    behavior: [Behavior.nocturnal, Behavior.pack],
    description:
      'Red-skinned creatures covered in spikes with glowing red eyes and long claws',
    drops: [
      { id: 'hentra_spike', rate: 0.5 },
      { id: 'glowing_eye', rate: 0.5 },
      { id: 'desert_essence', rate: 0.5 },
    ],
    intelligence: Intelligence.cunning,
    lore: 'Desert predators that have adapted to hunt in the coldest nights when other creatures are most vulnerable',
    maxLevel: 12,
    minLevel: 7,
    name: 'Hentra',
    rarity: Rarity.common,
    size: Size.medium,
    validBiomes: ['desert'],
    weaknesses: [DamageType.light, DamageType.holy],
    xpValue: 600,
  },
  hollow_one: {
    abilities: ['haunting_whistle'],
    aggression: Aggression.aggressive,
    baseHealth: 5,
    behavior: [Behavior.nocturnal, Behavior.pack],
    description:
      'Tall, gaunt beings with large circular holes through their torsos that emit haunting whistles',
    drops: [
      { id: 'void_essence', rate: 0.5 },
      { id: 'hollow_bone', rate: 0.5 },
    ],
    intelligence: Intelligence.cunning,
    lore: 'Spirits of those who died of starvation, cursed to eternally seek sustenance',
    maxLevel: 12,
    minLevel: 8,
    name: 'Hollow One',
    rarity: Rarity.uncommon,
    size: Size.large,
    validBiomes: ['mountains', 'alpine', 'coast'],
    weaknesses: [DamageType.holy, DamageType.sonic],
    xpValue: 700,
  },
  kadla: {
    abilities: ['vine_whip', 'bite', 'root_growth'],
    aggression: Aggression.defensive,
    baseHealth: 10,
    behavior: [Behavior.nocturnal, Behavior.diurnal],
    description:
      'Large slow moving creatures with vines growing from their arms and gaping mouths filled with spine-like teeth',
    drops: [
      { id: 'vine_essence', rate: 0.5 },
      { id: 'spine_tooth', rate: 0.5 },
      { id: 'kadla_hide', rate: 0.5 },
    ],
    intelligence: Intelligence.animal,
    lore: 'These ancient forest dwellers are believed to be failed experiments of a long-lost civilization attempting to merge plant and animal life',
    maxLevel: 8,
    minLevel: 5,
    name: 'Kadla',
    rarity: Rarity.uncommon,
    size: Size.large,
    validBiomes: ['forest'],
    weaknesses: [DamageType.fire, DamageType.frost],
    xpValue: 450,
  },
  marrow_mother: {
    abilities: ['lullaby', 'bone_embrace', 'absorb_flesh'],
    aggression: Aggression.defensive,
    baseHealth: 15,
    behavior: [Behavior.territorial, Behavior.nocturnal],
    description:
      "Large maternal creatures with soft flesh hiding a skeleton made of victims' bones",
    drops: [
      {
        id: 'absorbed_bone',
        rate: 0.5,
      },
      {
        id: 'morphic_flesh',
        rate: 0.5,
      },
      {
        id: 'dark_essence',
        rate: 0.5,
      },
    ],
    intelligence: Intelligence.cunning,
    lore: 'Cursed beings that collect bones to fill the void of lost children',
    maxLevel: 18,
    minLevel: 13,
    name: 'Marrow Mother',
    rarity: Rarity.rare,
    size: Size.large,
    validBiomes: [],
    weaknesses: [DamageType.holy, DamageType.piercing],
    xpValue: 950,
  },
  mind_weaver: {
    abilities: ['fear_reflection', 'shard_storm'],
    aggression: Aggression.aggressive,
    baseHealth: 5,
    behavior: [Behavior.solitary],
    description:
      'Floating crystalline beings that reflect distorted fears and can fragment into sharp shards',
    drops: [
      { id: 'nightmare_crystal', rate: 0.5 },
      { id: 'dark_essence', rate: 0.5 },
      { id: 'distorted_mirror', rate: 0.5 },
    ],
    intelligence: Intelligence.intelligent,
    lore: 'Manifestations of collective nightmares given form by dark magic',
    maxLevel: 20,
    minLevel: 14,
    name: 'Mind Weaver',
    rarity: Rarity.rare,
    size: Size.medium,
    validBiomes: [
      'alpine',
      'mountains',
      'ocean',
      'coast',
      'coral',
      'volcanicIsland',
    ],
    weaknesses: [DamageType.sonic, DamageType.force],
    xpValue: 1000,
  },
  reaver: {
    abilities: ['soul_rend', 'death_shroud', 'void_step'],
    aggression: Aggression.frenzied,
    baseHealth: 10,
    behavior: [Behavior.territorial, Behavior.nocturnal],
    description:
      'Mystical beings in black robes with sharp teeth and bone claws that float above the ground',
    drops: [
      { id: 'void_essence', rate: 0.5 },
      { id: 'reaver_robe', rate: 0.5 },
      { id: 'bone_claw', rate: 0.5 },
      { id: 'soul_shard', rate: 0.5 },
    ],
    intelligence: Intelligence.intelligent,
    lore: 'The ultimate evil in Vergundia, their true origins are unknown but they are said to be harbingers of doom',
    maxLevel: 30,
    minLevel: 20,
    name: 'Reaver',
    rarity: Rarity.legendary,
    size: Size.large,
    validBiomes: [],
    weaknesses: [DamageType.fire, DamageType.holy],
    xpValue: 2000,
  },
  slevna: {
    abilities: ['shadow_bite'],
    aggression: Aggression.defensive,
    baseHealth: 10,
    behavior: [Behavior.nocturnal, Behavior.pack],
    description: 'Dog-sized creatures that lurk in dark and damp places',
    drops: [
      { id: 'slevna_hide', rate: 0.5 },
      { id: 'dark_essence', rate: 0.5 },
    ],
    intelligence: Intelligence.animal,
    lore: 'Scavengers that have evolved to thrive in the forgotten corners of the world',
    maxLevel: 5,
    minLevel: 2,
    name: 'Slevna',
    rarity: Rarity.common,
    size: Size.small,
    validBiomes: ['forest', 'marsh', 'mountains'],
    weaknesses: [DamageType.light, DamageType.fire],
    xpValue: 150,
  },
  wildling: {
    abilities: ['feral_rage'],
    aggression: Aggression.aggressive,
    baseHealth: 5,
    behavior: [Behavior.pack, Behavior.territorial],
    description:
      'Humanoid creatures with hair-covered fronts and exposed spine bones piercing through their backs',
    drops: [
      { id: 'spine_fragment', rate: 0.5 },
      { id: 'cursed_hair', rate: 0.5 },
      { id: 'tainted_blood', rate: 0.5 },
    ],
    intelligence: Intelligence.intelligent,
    lore: 'Once human settlers who underwent terrible transformations after drinking from cursed springs',
    maxLevel: 8,
    minLevel: 4,
    name: 'Wildling',
    rarity: Rarity.common,
    size: Size.medium,
    validBiomes: [],
    weaknesses: [DamageType.holy, DamageType.silver],
    xpValue: 350,
  },
  writher: {
    abilities: ['bite', 'constrict'],
    aggression: Aggression.aggressive,
    baseHealth: 10,
    behavior: [Behavior.solitary, Behavior.territorial],
    description:
      'Emaciated humanoids with extremely long, serpentine necks and translucent skin showing internal organs',
    drops: [
      { id: 'writher_vertebrae', rate: 0.5 },
      { id: 'corrupted_organ', rate: 0.5 },
    ],
    intelligence: Intelligence.cunning,
    lore: 'Products of forbidden experiments attempting to extend human life beyond its natural limits',
    maxLevel: 15,
    minLevel: 10,
    name: 'Writher',
    rarity: Rarity.rare,
    size: Size.large,
    validBiomes: ['desert', 'oasis', 'saltFlat', 'marsh'],
    weaknesses: [DamageType.holy, DamageType.lightning],
    xpValue: 800,
  },
  zergon: {
    abilities: ['horn_charge', 'tremor_stomp'],
    aggression: Aggression.defensive,
    baseHealth: 15,
    behavior: [Behavior.pack, Behavior.territorial],
    description:
      'Giant humanoids with three eyes and deep blue skin, half covered in fur with prominent horns',
    drops: [
      { id: 'zergon_horn', rate: 0.5 },
      { id: 'giant_fur', rate: 0.5 },
      { id: 'mountain_crystal', rate: 0.5 },
    ],
    intelligence: Intelligence.intelligent,
    lore: 'Mountain-dwelling giants who were once a proud warrior race before succumbing to a mysterious curse',
    maxLevel: 20,
    minLevel: 15,
    name: 'Zergon',
    rarity: Rarity.rare,
    size: Size.huge,
    validBiomes: ['mountains', 'alpine'],
    weaknesses: [DamageType.magic],
    xpValue: 1200,
  },
} as const satisfies Record<string, Monster>

export type MonsterId = keyof typeof MONSTERS
