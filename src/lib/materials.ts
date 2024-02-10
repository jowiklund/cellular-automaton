import { Entity, Gas, Liquid, Material, MaterialState, Solid, StaticMaterial } from "./types"

export const SAND: Solid = {
  id: 1,
  name: "Sand",
  type: "physicsMaterial",
  subtype: "solid",
  mass: 0.4,
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
  heatTransfer: 10,
  attemptToFill: [
    [1,0],
    [5,1],
    [5,-1]
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
  isVisible: true
}

export const WATER: Liquid = {
  id: 2,
  name: "Water",
  type: "physicsMaterial",
  subtype: "liquid",
  density: 0.5,
  mass: 0.2,
  color: [0,100,230],
  viscosity: 0.0,
  temperatureConversion: [255, 7],
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
  color: [180,30,15],
  viscosity: 0.0,
  heatTransfer: 10,
  heatLoss: 1,
  temperatureConversion: [0, 3],
  initialHeat: 255,
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
  temperatureConversion: [0, 2],
  initialHeat: 255,
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

export const materials: Material[] = [AIR, SAND, STONE, WATER, GOO, STATIC_STONE, WATER_VAPOUR, LAVA]
