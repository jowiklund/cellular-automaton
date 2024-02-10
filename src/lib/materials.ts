import { Entity, Gas, Liquid, Material, MaterialState, Solid, StaticMaterial } from "./types"

export const SAND: Solid = {
  id: 1,
  name: "Sand",
  type: "physicsMaterial",
  subtype: "solid",
  mass: 0.6,
  friction: 0.3,
  color: [217,175,61],
  attemptToFill: [
    [1,0],
    [1,1],
    [1,-1],
  ]
}

export const STONE: Solid = {
  id: 3,
  name: "Stone",
  type: "physicsMaterial",
  subtype: "solid",
  mass: 1,
  friction: 0.3,
  color: [125,125,125],
  maxHeatColor: [191, 45, 15],
  heatTransfer: 10,
  heatLoss: 1,
  heatConversions: [[200, 8]],
  attemptToFill: [
    [1,0],
  ]
}

export const AIR: StaticMaterial = {
  id: 0,
  name: "Air",
  type: "staticMaterial",
  color: [0,0,0],
  isVisible: false
}

export const STATIC_STONE: StaticMaterial = {
  id: 4,
  name: "Static stone",
  type: "staticMaterial",
  color: [80,80,80],
  isVisible: true,
  maxHeatColor: [180,30,15],
  heatLoss: 1,
}

export const WATER: Liquid = {
  id: 2,
  name: "Water",
  type: "physicsMaterial",
  subtype: "liquid",
  density: 0.5,
  mass: 0.3,
  color: [0,100,230],
  viscosity: 0.0,
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

export const SALT_WATER: Liquid = {
  id: 11,
  name: "Salt water",
  type: "physicsMaterial",
  subtype: "liquid",
  density: 0.5,
  mass: 0.2,
  color: [180,180,230],
  viscosity: 0.0,
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

export const SALT: Solid = {
  id: 12,
  name: "Salt",
  type: "physicsMaterial",
  subtype: "solid",
  mass: 0.4,
  friction: 0.3,
  color: [230,230,230],
  maxHeatColor: [255,140,140],
  contactConversions: [[2, 11]],
  heatConversions: [[255, 13]],
  attemptToFill: [
    [1,0],
    [1,1],
    [1,-1],
  ]
}

export const MOLTEN_SALT: Liquid = {
  id: 13,
  name: "Molten salt",
  type: "physicsMaterial",
  subtype: "liquid",
  density: 1,
  mass: 0.4,
  color: [180,130,130],
  viscosity: 0.0,
  heatTransfer: 10,
  heatLoss: 0,
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

export const OIL: Liquid = {
  id: 14,
  name: "Oil",
  type: "physicsMaterial",
  subtype: "liquid",
  density: 1,
  mass: 0.1,
  color: [30,60,30],
  viscosity: 0.0,
  heatTransfer: 10,
  heatLoss: 0,
  heatConversions: [[110, 9]],
  contactConversions: [[9, 9]],
  initialTemp: 0,
  attemptToFill: [
    [1,0],
    [0,1],
    [0,-1],
    [1,1],
    [1,-1],
  ]
}


export const LAVA: Liquid = {
  id: 8,
  name: "Lava",
  type: "physicsMaterial",
  subtype: "liquid",
  density: 1,
  mass: 0.9,
  color: [191, 45, 15],
  viscosity: 0.0,
  heatTransfer: 10,
  heatLoss: 1,
  maxHeatColor: [245, 152, 91],
  coldConversions: [[0, 3]],
  initialTemp: 255,
  attemptToFill: [
    [1,0],
    [0,1],
    [0,-1],
    [1,1],
    [1,-1],
  ]
}


export const WATER_VAPOUR: Gas = {
  id: 7,
  name: "Water vapour",
  type: "physicsMaterial",
  subtype: "gas",
  density: 0.1,
  mass: 0,
  color: [150,150,150],
  coldConversions: [[0, 2]],
  initialTemp: 255,
  heatLoss: 1,
  attemptToFill: [
    [-1,0],
    [0,1],
    [0,-1],
    [-1,1],
    [-1,-1],
  ]
}


export const GOO: Liquid = {
  id: 6,
  name: "Goo",
  type: "physicsMaterial",
  subtype: "liquid",
  density: 1,
  mass: 0.3,
  color: [40,200,40],
  viscosity: 0.0,
  attemptToFill: [
    [1,0],
    [0,1],
    [0,-1],
    [1,1],
    [1,-1],
  ]
}

export const FIRE: Gas = {
  id: 9,
  name: "Fire",
  type: "physicsMaterial",
  subtype: "gas",
  density: 0.1,
  mass: 0,
  color: [235, 106, 7],
  maxHeatColor: [255,255,255],
  coldConversions: [[0, 10]],
  initialTemp: 255,
  heatLoss: 8,
  attemptToFill: [
    [-1,0],
    [0,1],
    [0,-1],
    [-1,1],
    [-1,-1],
  ]
}

export const SMOKE: Gas = {
  id: 10,
  name: "Smoke",
  type: "physicsMaterial",
  subtype: "gas",
  density: 0.1,
  mass: 0,
  color: [80,80,80],
  coldConversions: [[0, 0]],
  initialTemp: 220,
  heatLoss: 10,
  attemptToFill: [
    [-1,0],
    [0,1],
    [0,-1],
    [-1,1],
    [-1,-1],
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

export const materials: Material[] = [AIR, SAND, SALT, SALT_WATER, STONE, WATER, GOO, STATIC_STONE, WATER_VAPOUR, LAVA, FIRE, SMOKE, MOLTEN_SALT, OIL]
