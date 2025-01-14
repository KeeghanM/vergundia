import { Requirement as r, type BiomeMap } from '../index.t'

export const biomes: BiomeMap = {
  ocean: {
    name: 'Ocean',
    conditions: {
      maxHeight: 0.4,
    },
    terrainTypes: {
      '-0.5': {
        type: 'deep ocean',
        label: '≈',
        color: '#000080',
        difficulty: 1,
        requirements: [r.BOAT],
      },
      '0.5': {
        type: 'ocean',
        label: '~',
        color: '#0000CD',
        difficulty: 1,
        requirements: [r.BOAT],
      },
      '1': {
        type: 'shallow water',
        label: '≋',
        color: '#4169E1',
        difficulty: 1,
      },
    },
    config: {
      terrainScale: 0.02,
      smallFeatureScale: 2,
      smallFeatureInfluence: 0.6,
    },
  },
  coral: {
    name: 'Coral Reef',
    conditions: {
      minHeight: 0.2,
      maxHeight: 0.4,
      minTemp: 0.7,
      requiresAdjacent: ['Ocean'],
      searchRadius: 2,
    },
    terrainTypes: {
      '-0.5': {
        type: 'coral reef',
        label: '░',
        color: '#20B2AA',
        difficulty: 1,
        requirements: [r.BOAT],
      },
    },
    config: {
      terrainScale: 0.01,
      smallFeatureScale: 2,
      smallFeatureInfluence: 0.4,
    },
  },
  coast: {
    name: 'Coastal',
    conditions: {
      minHeight: 0.35,
      maxHeight: 0.45,
      requiresAdjacent: ['Ocean'],
      searchRadius: 3,
    },
    terrainTypes: {
      '-0.8': { type: 'bay', label: '~', color: '#4169E1', difficulty: 1 },
      '-0.5': { type: 'beach', label: '·', color: '#F0E68C', difficulty: 1 },
      '0.2': { type: 'dunes', label: '︵', color: '#DEB887', difficulty: 1 },
      '1.0': { type: 'cliffs', label: '≡', color: '#A0522D', difficulty: 1 },
    },
    config: {
      terrainScale: 0.01,
      smallFeatureScale: 2,
      smallFeatureInfluence: 0.4,
    },
  },
  desert: {
    name: 'Desert',
    conditions: {
      minHeight: 0.4,
      maxHeight: 0.6,
      minTemp: 0.7,
      maxMoisture: 0.3,
      requiresAdjacent: ['Coastal', 'Plains', 'Desert'],
      searchRadius: 3,
    },
    terrainTypes: {
      '-0.5': { type: 'desert', label: '∴', color: '#D2B48C', difficulty: 1 },
      '0.2': { type: 'dunes', label: '︵', color: '#DEB887', difficulty: 1 },
      '1.0': { type: 'canyon', label: '∎', color: '#A0522D', difficulty: 1 },
    },
    config: {
      terrainScale: 0.01,
      smallFeatureScale: 2,
      smallFeatureInfluence: 0.4,
    },
  },
  saltFlat: {
    name: 'Salt Flats',
    conditions: {
      minHeight: 0.4,
      maxHeight: 0.6,
      minTemp: 0.7,
      maxMoisture: 0.1,
      requiresAdjacent: ['Desert'],
      searchRadius: 3,
    },
    terrainTypes: {
      '1': { type: 'salt flat', label: '□', color: '#F5F5F5', difficulty: 1 },
    },
    config: {
      terrainScale: 0.01,
      smallFeatureScale: 2,
      smallFeatureInfluence: 0.4,
    },
  },

  plains: {
    name: 'Plains',
    conditions: {
      minHeight: 0.4,
      maxHeight: 0.6,
      minTemp: 0.3,
      maxMoisture: 0.7,
      requiresAdjacent: ['Coastal'],
      searchRadius: 3,
    },
    terrainTypes: {
      '-0.8': { type: 'lake', label: '~', color: '#4169E1', difficulty: 1 },
      '-0.5': { type: 'marsh', label: '♠', color: '#2E8B57', difficulty: 1 },
      '0.5': { type: 'grassland', label: '"', color: '#90EE90', difficulty: 1 },
      '1.0': { type: 'hills', label: '⌢', color: '#228B22', difficulty: 1 },
    },
    config: {
      terrainScale: 2,
      smallFeatureScale: 3,
      smallFeatureInfluence: 0.3,
    },
  },
  forest: {
    name: 'Forest',
    conditions: {
      minHeight: 0.4,
      maxHeight: 0.6,
      minTemp: 0.3,
      minMoisture: 0.6,
      requiresAdjacent: ['Plains', 'Forest'],
      searchRadius: 2,
    },
    terrainTypes: {
      '-0.8': {
        type: 'pond',
        label: '~',
        color: '#4169E1',
        difficulty: 1,
        requirements: [r.BOAT],
      },
      '-0.5': {
        type: 'undergrowth',
        label: ',',
        color: '#228B22',
        difficulty: 1,
      },
      '0.5': { type: 'woods', label: '♣', color: '#006400', difficulty: 1 },
      '1.0': {
        type: 'dense forest',
        label: '♠',
        color: '#004200',
        difficulty: 1,
        requirements: [r.CUT],
      },
    },
    config: {
      terrainScale: 0.01,
      smallFeatureScale: 2,
      smallFeatureInfluence: 0.5,
    },
  },
  mountains: {
    name: 'Mountains',
    conditions: {
      minHeight: 0.6,
      maxHeight: 0.8,
      maxTemp: 0.4,
      requiresAdjacent: ['Mountain'],
      searchRadius: 2,
    },
    terrainTypes: {
      '-0.8': { type: 'valley', label: 'v', color: '#4169E1', difficulty: 1 },
      '-0.5': {
        type: 'foothills',
        label: '⌢',
        color: '#A0522D',
        difficulty: 1,
      },
      '0.5': {
        type: 'peaks',
        label: '△',
        color: '#808080',
        difficulty: 1,
        requirements: [r.CLIMB],
      },
      '1.0': {
        type: 'summit',
        label: '▲',
        color: '#696969',
        difficulty: 1,
        requirements: [r.CLIMB],
      },
    },
    config: {
      terrainScale: 0.01,
      smallFeatureScale: 2,
      smallFeatureInfluence: 0.6,
    },
  },
  alpine: {
    name: 'Alpine',
    conditions: {
      minHeight: 0.8,
      maxTemp: 0.3,
    },
    terrainTypes: {
      '-0.8': {
        type: 'glacier lake',
        label: '≋',
        color: '#B0E0E6',
        difficulty: 1,
      },
      '-0.5': {
        type: 'ice field',
        label: '❄',
        color: '#E0FFFF',
        difficulty: 1,
      },
      '0.5': {
        type: 'peaks',
        label: '△',
        color: '#A9A9A9',
        difficulty: 1,
        requirements: [r.CLIMB],
      },
      '1.0': {
        type: 'eternal snow',
        label: '※',
        color: 'white',
        difficulty: 1,
        requirements: [r.CLIMB],
      },
    },
    config: {
      terrainScale: 0.005,
      smallFeatureScale: 4,
      smallFeatureInfluence: 0.7,
    },
  },
  oasis: {
    name: 'Oasis',
    conditions: {
      minHeight: 0.45,
      maxHeight: 0.55,
      minTemp: 0.8,
      maxMoisture: 0.4,
      requiresAdjacent: ['Desert'],
      searchRadius: 8,
    },
    terrainTypes: {
      '1.0': { type: 'oasis', label: '≈', color: '#4169E1', difficulty: 1 },
    },
    config: {
      terrainScale: 0.01,
      smallFeatureScale: 2,
      smallFeatureInfluence: 0.4,
    },
  },
  volcanicIsland: {
    name: 'Volcanic Island',
    conditions: {
      minHeight: 0.7,
      minTemp: 0.8,
      requiresAdjacent: ['Ocean'],
      searchRadius: 2,
    },
    terrainTypes: {
      '-0.8': {
        type: 'volcanic beach',
        label: '·',
        color: '#1a1a1a',
        difficulty: 1,
      },
      '0.8': {
        type: 'volcanic rock',
        label: '♨',
        color: '#2d2d2d',
        difficulty: 1,
      },
      '1': { type: 'lava flows', label: '≋', color: '#ff4400', difficulty: 1 },
    },
    config: {
      terrainScale: 0.01,
      smallFeatureScale: 2,
      smallFeatureInfluence: 0.4,
    },
  },
}
