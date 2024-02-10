import { Entity, Material, MaterialState } from "./types"


export const AIR: Material = {
  id: 0,
  name: "Air",
  type: "staticMaterial",
  conductivity: 0,
  color: [0,0,0],
  isVisible: false
}

export const SAND: Material = {
  id: 1,
  name: "Sand",
  type: "physicsMaterial",
  conductivity: 125,
  subtype: {
    type: "solid",
    friction: 0
  },
  density: 100,
  color: [217,175,61],
  attemptToFill: [
    [1,0],
    [1,1],
    [1,-1],
  ]
}

export const WATER: Material = {
  id: 2,
  name: "Water",
  type: "physicsMaterial",
  conductivity: 200,
  subtype: {
    type: "liquid",
    viscosity: 0
  },
  density: 50,
  color: [0,100,230],
  initialTemp: 1,
  heatConversions: [[30, 7]],
  attemptToFill: [
    [1,0],
    [0,1],
    [0,-1],
    [1,1],
    [1,-1],
  ]
}

export const STONE: Material = {
  id: 3,
  name: "Stone",
  type: "physicsMaterial",
  conductivity: 10,
  subtype: {
    type: "solid",
    friction: 50
  },
  density: 100,
  color: [125,125,125],
  maxHeatColor: [191, 45, 15],
  heatRetention: 200,
  heatConversions: [[200, 8]],
  attemptToFill: [
    [1,0],
  ]
}

export const STATIC_STONE: Material = {
  id: 4,
  name: "Static stone",
  type: "staticMaterial",
  conductivity: 10,
  color: [80,80,80],
  isVisible: true,
  maxHeatColor: [180,30,15],
  heatRetention: 250,
}

export const GOO: Material = {
  id: 6,
  name: "Goo",
  type: "physicsMaterial",
  conductivity: 10,
  subtype: {
    type: "liquid",
    viscosity: 25
  },
  density: 30,
  color: [40,200,40],
  attemptToFill: [
    [1,0],
    [0,1],
    [0,-1],
    [1,1],
    [1,-1],
  ]
}

export const WATER_VAPOUR: Material = {
  id: 7,
  name: "Water vapour",
  type: "physicsMaterial",
  conductivity: 0,
  subtype: {
    type: "gas",
  },
  density: 0,
  color: [150,150,200],
  coldConversions: [[15, 2]],
  initialTemp: 255,
  heatRetention: 240,
  attemptToFill: [
    [-1,0],
    [0,1],
    [0,-1],
    [-1,1],
    [-1,-1],
  ]
}

export const LAVA: Material = {
  id: 8,
  name: "Lava",
  type: "physicsMaterial",
  conductivity: 200,
  subtype: {
    type: "liquid",
    viscosity: 50
  },
  density: 90,
  color: [191, 45, 15],
  heatRetention: 254,
  maxHeatColor: [245, 152, 91],
  coldConversions: [[150, 3]],
  initialTemp: 255,
  attemptToFill: [
    [1,0],
    [0,1],
    [0,-1],
    [1,1],
    [1,-1],
  ]
}

export const FIRE: Material = {
  id: 9,
  name: "Fire",
  type: "physicsMaterial",
  conductivity: 200,
  subtype: {
    type: "gas"
  },
  density: 0,
  color: [235, 106, 7],
  maxHeatColor: [255,255,255],
  coldConversions: [[0, 10]],
  initialTemp: 255,
  heatRetention: 40,
  attemptToFill: [
    [-1,0],
    [0,1],
    [0,-1],
    [-1,1],
    [-1,-1],
  ]
}

export const SMOKE: Material = {
  id: 10,
  name: "Smoke",
  type: "physicsMaterial",
  conductivity: 50,
  subtype: {
    type: "gas"
  },
  density: 0,
  color: [80,80,80],
  coldConversions: [[0, 0]],
  initialTemp: 220,
  heatRetention: 5,
  attemptToFill: [
    [-1,0],
    [0,1],
    [0,-1],
    [-1,1],
    [-1,-1],
  ]
}

export const SALT_WATER: Material = {
  id: 11,
  name: "Salt water",
  type: "physicsMaterial",
  conductivity: 255,
  subtype: {
    type: "liquid",
    viscosity: 0
  },
  density: 45,
  color: [180,180,230],
  initialTemp: 1,
  heatConversions: [[100, 7], [100, 12]],
  attemptToFill: [
    [1,0],
    [0,1],
    [0,-1],
    [1,1],
    [1,-1],
  ]
}

export const SALT: Material = {
  id: 12,
  name: "Salt",
  type: "physicsMaterial",
  conductivity: 10,
  subtype: {
    type: "solid",
    friction: 25
  },
  density: 75,
  color: [230,230,230],
  maxHeatColor: [255,140,140],
  reactons: [[2, 11]],
  heatConversions: [[255, 13]],
  attemptToFill: [
    [1,0],
    [1,1],
    [1,-1],
  ]
}

export const MOLTEN_SALT: Material = {
  id: 13,
  name: "Molten salt",
  type: "physicsMaterial",
  conductivity: 10,
  subtype: {
    type: "liquid",
    viscosity: 0
  },
  density: 70,
  color: [180,130,130],
  heatRetention: 250,
  coldConversions: [[0, 12]],
  initialTemp: 255,
  attemptToFill: [
    [1,0],
    [0,1],
    [0,-1],
    [1,1],
    [1,-1],
  ]
}

export const OIL: Material = {
  id: 14,
  name: "Oil",
  type: "physicsMaterial",
  conductivity: 255,
  subtype: {
    type: "liquid",
    viscosity: 25
  },
  density: 40,
  color: [30,60,30],
  heatRetention: 250,
  heatConversions: [[110, 9]],
  reactons: [[9, 9]],
  initialTemp: 0,
  attemptToFill: [
    [1,0],
    [0,1],
    [0,-1],
    [1,1],
    [1,-1],
  ]
}

export const STATIC_METAL: Material = {
  id: 15,
  name: "Static metal",
  type: "staticMaterial",
  conductivity: 230,
  color: [43, 49, 51],
  isVisible: true,
  maxHeatColor: [125, 53, 44],
  heatRetention: 254,
  heatConversions: [[200, 16]]
}

export const MOLTEN_METAL: Material = {
  id: 16,
  name: "Molten metal",
  density: 230,
  subtype: {
    "type": "liquid",
    viscosity: 250
  },
  type: "physicsMaterial",
  conductivity: 10,
  color: [125, 53, 44],
  maxHeatColor: [255, 218, 130],
  heatRetention: 254,
  initialTemp: 255,
  coldConversions: [[100, 17]],
  attemptToFill: [
    [1,0],
    [0,1],
    [0,-1],
    [1,1],
    [1,-1],
  ]
}

export const METAL: Material = {
  id: 17,
  name: "Metal",
  density: 230,
  subtype: {
    "type": "solid",
    friction: 100
  },
  type: "physicsMaterial",
  conductivity: 60,
  color: [43, 49, 51],
  maxHeatColor: [125, 53, 44],
  heatRetention: 230,
  heatConversions: [[200, 16]],
  attemptToFill: [
    [1,0],
    [1,1],
    [1,-1],
  ]
}

export function parseMaterialState(state: MaterialState, materials: Material[]): Entity {
  const data = state.split(",").map(parseInt);
  return {
    material: materials[data[0]],
    state: {
      temperature: data[1],
      velocity: data[2]
    }
  }
}

export const materials: Material[] = [
  AIR,
  STATIC_STONE,
  SAND,
  SALT,
  STONE,
  WATER,
  LAVA,
  SALT_WATER,
  FIRE,
  WATER_VAPOUR,
  SMOKE,
  MOLTEN_SALT,
  GOO,
  OIL,
  METAL,
  MOLTEN_METAL,
  STATIC_METAL
]
