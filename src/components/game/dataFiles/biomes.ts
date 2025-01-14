export const biomes = {
  '-0.6': {
    name: 'Ocean',
    terrainTypes: {
      '-0.8': { type: 'deep ocean', label: '≈', color: '#000080' }, // Deep waves
      '-0.5': { type: 'ocean', label: '~', color: '#0000CD' }, // Waves
      '0.2': { type: 'shallow water', label: '≋', color: '#4169E1' }, // Ripples
      '1.0': { type: 'reef', label: '░', color: '#87CEEB' }, // Coral texture
    },
    config: {
      terrainScale: 0.12,
      smallFeatureScale: 2,
      smallFeatureInfluence: 0.6,
    },
  },
  '-0.5': {
    name: 'Coastal',
    terrainTypes: {
      '-0.8': { type: 'bay', label: '~', color: '#4169E1' }, // Reuse wave symbol
      '-0.5': { type: 'beach', label: '·', color: '#F0E68C' }, // Small dot for sand
      '0.2': { type: 'dunes', label: '︵', color: '#DEB887' }, // Wave-like for dunes
      '1.0': { type: 'cliffs', label: '≡', color: '#A0522D' }, // Parallel lines for cliffs
    },
    config: {
      terrainScale: 0.1,
      smallFeatureScale: 2,
      smallFeatureInfluence: 0.4,
    },
  },
  '0.0': {
    name: 'Plains',
    terrainTypes: {
      '-0.8': { type: 'lake', label: '~', color: '#4169E1' }, // Reuse wave symbol
      '-0.5': { type: 'marsh', label: '♠', color: '#2E8B57' }, // Club suit for vegetation
      '0.5': { type: 'grassland', label: '"', color: '#90EE90' }, // Quote for grass
      '1.0': { type: 'hills', label: '⌢', color: '#228B22' }, // Arc for hills
    },
    config: {
      terrainScale: 0.08,
      smallFeatureScale: 3,
      smallFeatureInfluence: 0.3,
    },
  },
  '0.6': {
    name: 'Forest',
    terrainTypes: {
      '-0.8': { type: 'pond', label: '~', color: '#4169E1' }, // Reuse wave symbol
      '-0.5': { type: 'undergrowth', label: ',', color: '#228B22' }, // Comma for small plants
      '0.5': { type: 'woods', label: '♣', color: '#006400' }, // Club for trees
      '1.0': { type: 'dense forest', label: '♠', color: '#004200' }, // Spade for thick forest
    },
    config: {
      terrainScale: 0.1,
      smallFeatureScale: 2,
      smallFeatureInfluence: 0.5,
    },
  },
  '0.85': {
    name: 'Mountains',
    terrainTypes: {
      '-0.8': { type: 'valley', label: 'v', color: '#4169E1' }, // V for valley
      '-0.5': { type: 'foothills', label: '⌢', color: '#A0522D' }, // Reuse arc for hills
      '0.5': { type: 'peaks', label: '△', color: '#808080' }, // Triangle outline for peaks
      '1.0': { type: 'summit', label: '▲', color: '#696969' }, // Solid triangle for high peaks
    },
    config: {
      terrainScale: 0.1,
      smallFeatureScale: 2,
      smallFeatureInfluence: 0.6,
    },
  },
  '1.0': {
    name: 'Alpine',
    terrainTypes: {
      '-0.8': { type: 'glacier lake', label: '≋', color: '#B0E0E6' }, // Reuse ripple
      '-0.5': { type: 'ice field', label: '❄', color: '#E0FFFF' }, // Snowflake
      '0.5': { type: 'peaks', label: '△', color: '#A9A9A9' }, // Reuse triangle outline
      '1.0': { type: 'eternal snow', label: '※', color: 'white' }, // Asterisk for snow
    },
    config: {
      terrainScale: 0.05,
      smallFeatureScale: 4,
      smallFeatureInfluence: 0.7,
    },
  },
}
