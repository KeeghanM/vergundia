export type Item = {
  name: string
  description: string
  value: number
  weight: number
}

export const ITEMS = {
  absorbed_bone: {
    description: 'A bone that has been absorbed, dissolved, and spat back out',
    name: 'Absorbed Bone',
    value: 50,
    weight: 0.5,
  },
  bone_claw: {
    description: 'A wickedly sharp claw made of an unknown bone material',
    name: 'Bone Claw',
    value: 250,
    weight: 0.5,
  },
  corrupted_organ: {
    description: 'An organ that has been twisted by dark magic',
    name: 'Corrupted Organ',
    value: 100,
    weight: 0.5,
  },
  cursed_hair: {
    description: 'A lock of hair emanating dark energy',
    name: 'Cursed Hair',
    value: 50,
    weight: 0.1,
  },
  dark_essence: {
    description: 'A swirling essence that seems to absorb light',
    name: 'Dark Essence',
    value: 150,
    weight: 0.1,
  },
  dark_tendril: {
    description: 'A dark tendril that seems to move on its own',
    name: 'Dark Tendril',
    value: 100,
    weight: 0.5,
  },
  desert_essence: {
    description: 'The concentrated essence of the desert itself',
    name: 'Desert Essence',
    value: 150,
    weight: 0.1,
  },
  distorted_mirror: {
    description: 'A mirror that shows twisted reflections of reality',
    name: 'Distorted Mirror',
    value: 100,
    weight: 1,
  },
  echo_organ: {
    description: 'Fleshy ear ripped from an Echo Stalker',
    name: 'Echo Organ',
    value: 100,
    weight: 0.5,
  },
  fused_bones: {
    description: 'Bones fused together in a strange pattern',
    name: 'Fused Bones',
    value: 75,
    weight: 0.5,
  },
  giant_fur: {
    description: 'A massive pelt from a giant creature',
    name: 'Giant Fur',
    value: 75,
    weight: 2,
  },
  glowing_eye: {
    description: 'An eye pulled from its socket, that still glows in the dark',
    name: 'Glowing Eye',
    value: 50,
    weight: 0.1,
  },
  hentra_spike: {
    description: 'A large spike that can be used for crafting',
    name: 'Hentra Spike',
    value: 100,
    weight: 0.5,
  },
  hollow_bone: {
    description: 'A hollow bone that can be used for crafting',
    name: 'Hollow Bone',
    value: 25,
    weight: 0.1,
  },
  kadla_hide: {
    description: 'A tough hide that can be used for armor',
    name: 'Kadla Hide',
    value: 75,
    weight: 1,
  },
  morphic_flesh: {
    description: 'Flesh that constantly churns and shifts',
    name: 'Morphic Flesh',
    value: 100,
    weight: 0.5,
  },
  mountain_crystal: {
    description: 'A large, glowing crystal found in the mountains',
    name: 'Mountain Crystal',
    value: 125,
    weight: 1,
  },
  nightmare_crystal: {
    description:
      'A crystal that seems to pulse with dark energy, looking into it fills you with dread',
    name: 'Nightmare Crystal',
    value: 200,
    weight: 1,
  },
  reaver_robe: {
    description: 'A sinister black robe that seems to move on its own',
    name: 'Reaver Robe',
    value: 1000,
    weight: 2,
  },
  slevna_hide: {
    description: 'A scaly slimy hide',
    name: 'Slevna Hide',
    value: 25,
    weight: 1,
  },
  soul_shard: {
    description: 'A crystallized fragment of a soul',
    name: 'Soul Shard',
    value: 2000,
    weight: 0.1,
  },
  spine_fragment: {
    description: 'A piece of a spine that can be used for crafting',
    name: 'Spine Fragment',
    value: 25,
    weight: 0.1,
  },
  spine_tooth: {
    description: 'A sharp tooth that can pierce armor',
    name: 'Spine Tooth',
    value: 25,
    weight: 0.2,
  },
  tainted_blood: {
    description: 'A vile liquid that seems to pulse with life... or death',
    name: 'Tainted Blood',
    value: 100,
    weight: 0.2,
  },
  vine_essence: {
    description: 'A mystical essence extracted from magical vines',
    name: 'Vine Essence',
    value: 50,
    weight: 0.1,
  },
  void_essence: {
    description: 'A swirling essence that seems to absorb light',
    name: 'Void Essence',
    value: 500,
    weight: 0.1,
  },
  writher_vertebrae: {
    description:
      "One of the many bones that make up a Writher's unnaturally long neck",
    name: 'Writher Vertebrae',
    value: 100,
    weight: 0.5,
  },
  zergon_horn: {
    description: 'A curved horn ripped from the head of a Zergon',
    name: 'Zergon Horn',
    value: 100,
    weight: 0.5,
  },
} as const satisfies Record<string, Item>

// Make a type of valid item IDs from the ITEMS object
export type ItemId = keyof typeof ITEMS
