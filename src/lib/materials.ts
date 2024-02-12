import { AMBIANCE, MAX_INT } from "./constants"
import { Entity, Material, MaterialState } from "./types"

const percent = (value: number) => MAX_INT * value

export const AIR: Material = {
  id: 0,
  name: "Air",
  type: "staticMaterial",
  conductivity: percent(0.01),
  color: [0,0,0],
  heatRetention: percent(0.1),
  isVisible: false,
  initialTemp: AMBIANCE
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
  conductivity: percent(0.8),
  subtype: {
    type: "liquid",
    viscosity: 0
  },
  density: 50,
  color: [0,100,230],
  initialTemp: 300,
  heatRetention: percent(0.5),
  heatConversions: [[373, 4]],
  coldConversions: [[273, 3]],
  attemptToFill: [
    [1,0],
    [0,1],
    [0,-1],
    [1,1],
    [1,-1],
  ]
}

export const ICE: Material = {
  id: 3,
  name: "Ice",
  type: "staticMaterial",
  conductivity: percent(0.9),
  color: [0,60,80],
  isVisible: true,
  heatRetention: percent(0.9),
  initialTemp: 80,
  heatConversions: [[274, 2]]
}

export const WATER_VAPOUR: Material = {
  id: 4,
  name: "Water vapour",
  type: "physicsMaterial",
  conductivity: 0,
  subtype: {
    type: "gas",
  },
  density: 0,
  color: [150,150,200],
  coldConversions: [[372, 2]],
  initialTemp: 400,
  heatRetention: percent(0.95),
  attemptToFill: [
    [-1,0],
    [0,1],
    [0,-1],
    [-1,1],
    [-1,-1],
  ]
}

export const STATIC_METAL: Material = {
  id: 5,
  name: "Static metal",
  type: "staticMaterial",
  conductivity: 230,
  color: [43, 49, 51],
  isVisible: true,
  maxHeatColor: [125, 53, 44],
  maxColorTemp: 1800,
  heatRetention: percent(0.9),
  heatConversions: [[1800, 6]]
}

export const MOLTEN_METAL: Material = {
  id: 6,
  name: "Molten metal",
  density: 230,
  subtype: {
    "type": "liquid",
    viscosity: 250
  },
  type: "physicsMaterial",
  conductivity: percent(0.8),
  color: [125, 53, 44],
  maxHeatColor: [255, 218, 130],
  heatRetention: percent(0.7),
  initialTemp: 5000,
  maxColorTemp: 1900,
  minColorTemp: 1800,
  coldConversions: [[1800, 7]],
  attemptToFill: [
    [1,0],
    [0,1],
    [0,-1],
    [1,1],
    [1,-1],
  ]
}

export const METAL: Material = {
  id: 7,
  name: "Metal",
  density: 230,
  subtype: {
    "type": "solid",
    friction: 100
  },
  type: "physicsMaterial",
  conductivity: percent(0.9),
  color: [43, 49, 51],
  maxHeatColor: [125, 53, 44],
  maxColorTemp: 1811,
  minColorTemp: 293,
  heatRetention: percent(0.9),
  initialTemp: AMBIANCE,
  heatConversions: [[1811, 6]],
  reactons: [[2, 13, 0.05]],
  attemptToFill: [
    [1,0],
    [1,1],
    [1,-1],
  ]
}

export const STONE: Material = {
  id: 8,
  name: "Stone",
  type: "physicsMaterial",
  conductivity: percent(0.2),
  subtype: {
    type: "solid",
    friction: 50
  },
  density: 100,
  color: [125,125,125],
  maxHeatColor: [191, 45, 15],
  maxColorTemp: 1500,
  minColorTemp: 292,
  initialTemp: AMBIANCE,
  heatRetention: percent(0.9),
  heatConversions: [[1500, 10]],
  attemptToFill: [
    [1,0],
  ]
}

export const STATIC_STONE: Material = {
  id: 9,
  name: "Static stone",
  type: "staticMaterial",
  conductivity: percent(0.1),
  color: [80,80,80],
  isVisible: true,
  maxHeatColor: [180,30,15],
  heatRetention: percent(0.9),
}

export const LAVA: Material = {
  id: 10,
  name: "Lava",
  type: "physicsMaterial",
  conductivity: percent(0.2),
  subtype: {
    type: "liquid",
    viscosity: 50
  },
  density: 120,
  color: [191, 45, 15],
  heatRetention: percent(0.9),
  maxHeatColor: [245, 152, 91],
  minColorTemp: 1490,
  coldConversions: [[1490, 8]],
  initialTemp: 2500,
  attemptToFill: [
    [1,0],
    [0,1],
    [0,-1],
    [1,1],
    [1,-1],
  ]
}

export const FIRE: Material = {
  id: 11,
  name: "Fire",
  type: "physicsMaterial",
  conductivity: percent(0.7),
  subtype: {
    type: "gas"
  },
  density: 0,
  color: [235, 106, 7],
  maxHeatColor: [255,255,255],
  coldConversions: [[700, 12]],
  initialTemp: 1600,
  maxColorTemp: 1600,
  heatRetention: percent(0.2),
  attemptToFill: [
    [-1,0],
    [0,1],
    [0,-1],
    [-1,1],
    [-1,-1],
  ]
}

export const SMOKE: Material = {
  id: 12,
  name: "Smoke",
  type: "physicsMaterial",
  conductivity: percent(0.2),
  subtype: {
    type: "gas"
  },
  density: 0,
  color: [80,80,80],
  coldConversions: [[300, 0]],
  initialTemp: 700,
  heatRetention: percent(0.5),
  attemptToFill: [
    [-1,0],
    [0,1],
    [0,-1],
    [-1,1],
    [-1,-1],
  ]
}

export const RUST: Material = {
  id: 13,
  name: "Rust",
  density: 230,
  subtype: {
    "type": "solid",
    friction: 100
  },
  type: "physicsMaterial",
  conductivity: percent(0.4),
  color: [186, 82, 37],
  maxHeatColor: [125, 53, 44],
  maxColorTemp: 1900,
  minColorTemp: 293,
  heatRetention: percent(0.9),
  initialTemp: AMBIANCE,
  heatConversions: [[1900, 6]],
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
  STONE,
  WATER,
  ICE,
  LAVA,
  FIRE,
  WATER_VAPOUR,
  SMOKE,
  METAL,
  MOLTEN_METAL,
  STATIC_METAL,
  RUST
]
