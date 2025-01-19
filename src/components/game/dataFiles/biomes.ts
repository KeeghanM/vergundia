import { Requirement as r, type BiomeMap } from '../index.t'

export const biomes: BiomeMap = {
  alpine: {
    conditions: {
      maxTemp: 0.3,
      minHeight: 0.85,
      requiresAdjacent: ['Mountains', 'Alpine'],
      searchRadius: 2,
    },
    config: {
      smallFeatureInfluence: 0.7,
      smallFeatureScale: 4,
      terrainScale: 0.005,
    },
    name: 'Alpine',
    terrainTypes: {
      '-0.5': {
        color: '#E0FFFF',
        difficulty: 3,
        label: '*',
        type: 'ice field',
      },
      '-0.8': {
        color: '#B0E0E6',
        difficulty: 2,
        label: '~',
        type: 'glacier lake',
      },
      '0.5': {
        color: '#DCDCDC',
        difficulty: 4,
        label: 'A',
        requirements: [r.CLIMB],
        type: 'peaks',
      },
      '1.0': {
        color: '#FFF',
        difficulty: 5,
        label: '^',
        requirements: [r.CLIMB],
        type: 'eternal snow',
      },
    },
  },
  coast: {
    conditions: {
      maxHeight: 0.45,
      minHeight: 0.28,
      requiresAdjacent: ['Ocean'],
      searchRadius: 2,
    },
    config: {
      smallFeatureInfluence: 0.4,
      smallFeatureScale: 2,
      terrainScale: 0.01,
    },
    name: 'Coastal',
    terrainTypes: {
      '-0.5': { color: '#DEB887', difficulty: 1, label: '·', type: 'beach' },
      '-0.8': { color: '#4169E1', difficulty: 1, label: '~', type: 'bay' },
      '0.2': { color: '#D2B48C', difficulty: 2, label: 'n', type: 'dunes' },
      '1.0': { color: '#A0522D', difficulty: 3, label: '#', type: 'cliffs' },
    },
  },
  coral: {
    conditions: {
      maxHeight: 0.4,
      minHeight: 0.2,
      minTemp: 0.7,
      requiresExclusiveAdjacent: ['Ocean'],
      searchRadius: 2,
    },
    config: {
      smallFeatureInfluence: 0.4,
      smallFeatureScale: 2,
      terrainScale: 0.01,
    },
    name: 'Coral Reef',
    terrainTypes: {
      '1': {
        color: '#20B2AA',
        difficulty: 2,
        label: '░',
        requirements: [r.BOAT],
        type: 'coral reef',
      },
    },
  },
  desert: {
    conditions: {
      maxHeight: 0.65,
      maxMoisture: 0.25,
      minHeight: 0.35,
      minTemp: 0.6,
      requiresAdjacent: ['Coastal', 'Plains', 'Desert'],
      searchRadius: 4,
    },
    config: {
      smallFeatureInfluence: 0.4,
      smallFeatureScale: 2,
      terrainScale: 0.01,
    },
    name: 'Desert',
    terrainTypes: {
      '-0.6': { color: '#DAA520', difficulty: 3, label: '·', type: 'desert' },
      '0.3': { color: '#DEB887', difficulty: 3, label: 'n', type: 'dunes' },
      '1.0': { color: '#A0522D', difficulty: 3, label: '=', type: 'canyon' },
    },
  },
  forest: {
    conditions: {
      maxHeight: 0.7,
      minHeight: 0.4,
      minMoisture: 0.55,
      minTemp: 0.3,
      requiresAdjacent: ['Plains', 'Forest'],
      searchRadius: 3,
    },
    config: {
      smallFeatureInfluence: 0.5,
      smallFeatureScale: 2,
      terrainScale: 0.01,
    },
    name: 'Forest',
    terrainTypes: {
      '-0.5': {
        color: '#228B22',
        difficulty: 2,
        label: '"',
        type: 'undergrowth',
      },
      '-0.8': {
        color: '#4169E1',
        difficulty: 1,
        label: '~',
        requirements: [r.SWIM],
        type: 'pond',
      },
      '0.5': { color: '#006400', difficulty: 3, label: 'Y', type: 'woods' },
      '1.0': {
        color: '#004200',
        difficulty: 5,
        label: '#',
        requirements: [r.CUT],
        type: 'dense forest',
      },
    },
  },
  marsh: {
    conditions: {
      maxHeight: 0.5,
      minHeight: 0.3,
      minMoisture: 0.65,
      minTemp: 0.4,
      requiresAdjacent: ['Coastal', 'Plains', 'Marsh'],
      searchRadius: 3,
    },
    config: {
      smallFeatureInfluence: 0.4,
      smallFeatureScale: 2,
      terrainScale: 0.01,
    },
    name: 'Marsh',
    terrainTypes: {
      '1': { color: '#2E8B57', difficulty: 2, label: '"', type: 'marsh' },
    },
  },
  mountains: {
    conditions: {
      maxHeight: 0.9,
      maxTemp: 0.4,
      minHeight: 0.6,
      requiresAdjacent: ['Mountains', 'Alpine'],
      searchRadius: 2,
    },
    config: {
      smallFeatureInfluence: 0.5,
      smallFeatureScale: 4,
      terrainScale: 0.008,
    },
    name: 'Mountains',
    terrainTypes: {
      '-0.3': {
        color: '#808080',
        difficulty: 2,
        label: 'n',
        type: 'foothills',
      },
      '-0.8': { color: '#696969', difficulty: 2, label: 'v', type: 'valley' },
      '0.8': {
        color: '#888888',
        difficulty: 4,
        label: 'A',
        requirements: [r.CLIMB],
        type: 'peaks',
      },
      '1.0': {
        color: '#D3D3D3',
        difficulty: 5,
        label: 'M',
        requirements: [r.CLIMB],
        type: 'summit',
      },
    },
  },
  oasis: {
    conditions: {
      maxMoisture: 0.4,
      minHeight: 0.35,
      minTemp: 0.8,
      requiresExclusiveAdjacent: ['Desert'],
      searchRadius: 4,
    },
    config: {
      smallFeatureInfluence: 0.4,
      smallFeatureScale: 2,
      terrainScale: 0.01,
    },
    name: 'Oasis',
    terrainTypes: {
      '1.0': { color: '#40E0D0', difficulty: 1, label: 'o', type: 'oasis' },
    },
  },
  ocean: {
    conditions: {
      maxHeight: 0.3,
    },
    config: {
      smallFeatureInfluence: 0.4,
      smallFeatureScale: 3,
      terrainScale: 0.015,
    },
    name: 'Ocean',
    terrainTypes: {
      '-0.7': {
        color: '#000066',
        difficulty: 2,
        label: '≋',
        requirements: [r.BOAT],
        type: 'deep ocean',
      },
      '0.2': {
        color: '#000099',
        difficulty: 2,
        label: '~',
        requirements: [r.BOAT],
        type: 'ocean',
      },
      '1': {
        color: '#0000CC',
        difficulty: 1,
        label: '░',
        type: 'shallow water',
      },
    },
  },
  plains: {
    conditions: {
      maxHeight: 0.55,
      maxMoisture: 0.7,
      minHeight: 0.38,
      minTemp: 0.3,
      requiresAdjacent: ['Coastal', 'Plains'],
      searchRadius: 3,
    },
    config: {
      smallFeatureInfluence: 0.3,
      smallFeatureScale: 3,
      terrainScale: 2,
    },
    name: 'Plains',
    terrainTypes: {
      '-0.8': {
        color: '#4169E1',
        difficulty: 1,
        label: '~',
        requirements: [r.BOAT],
        type: 'lake',
      },
      '0.5': { color: '#90EE90', difficulty: 1, label: ',', type: 'grassland' },
      '1.0': { color: '#228B22', difficulty: 2, label: 'n', type: 'hills' },
    },
  },
  saltFlat: {
    conditions: {
      maxHeight: 0.6,
      maxMoisture: 0.1,
      minHeight: 0.4,
      minTemp: 0.7,
      requiresAdjacent: ['Desert'],
      searchRadius: 3,
    },
    config: {
      smallFeatureInfluence: 0.4,
      smallFeatureScale: 2,
      terrainScale: 0.01,
    },
    name: 'Salt Flats',
    terrainTypes: {
      '1': { color: '#FFF', difficulty: 3, label: '_', type: 'salt flat' },
    },
  },
  volcanicIsland: {
    conditions: {
      minHeight: 0.7,
      minTemp: 0.8,
      requiresExclusiveAdjacent: ['Ocean'],
      searchRadius: 4,
    },
    config: {
      smallFeatureInfluence: 0.4,
      smallFeatureScale: 2,
      terrainScale: 0.01,
    },
    name: 'Volcanic Island',
    terrainTypes: {
      '-0.8': {
        color: '#1a1a1a',
        difficulty: 2,
        label: '·',
        type: 'volcanic beach',
      },
      '0.8': {
        color: '#2d2d2d',
        difficulty: 2,
        label: '^',
        type: 'volcanic rock',
      },
      '1': { color: '#ff4400', difficulty: 4, label: '%', type: 'lava flows' },
    },
  },
}
