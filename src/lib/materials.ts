type MaterialBase = {
  color: [number, number, number],
  name: string
}

type PhysicsMaterial = MaterialBase & {
  type: "physicsMaterial"
  mass: number
  attemptToFill: [ y: number, x:number ][]
}

type Solid = PhysicsMaterial & {
  friction: number
}

type Liquid = PhysicsMaterial & {
  viscosity: number
}

type StaticMaterial = MaterialBase & {
  type: "staticMaterial"
  isVisible: boolean
  color: [number, number, number],
}

type Material = PhysicsMaterial | StaticMaterial

const SAND: Solid = {
  name: "Sand",
  type: "physicsMaterial",
  mass: 0.4,
  friction: 0.3,
  color: [217,175,61],
  attemptToFill: [
    [1,0],
    [1,1],
    [1,-1],
  ]
}

const STONE: Solid = {
  name: "Stone",
  type: "physicsMaterial",
  mass: 0.6,
  friction: 0.3,
  color: [125,125,125],
  attemptToFill: [
    [1,0],
    [5,1],
    [5,-1]
  ]
}

const AIR: StaticMaterial = {
  name: "Air",
  type: "staticMaterial",
  color: [0,0,0],
  isVisible: false
}

const STATIC_STONE: StaticMaterial = {
  name: "Static stone",
  type: "staticMaterial",
  color: [80,80,80],
  isVisible: true
}

const WATER: Liquid = {
  name: "Water",
  type: "physicsMaterial",
  mass: 0.2,
  color: [0,100,230],
  viscosity: 0.2,
  attemptToFill: [
    [1,0],
    [0,1],
    [0,-1],
    [1,1],
    [1,-1],
  ]

}

export const materials: Material[] = [AIR, SAND, STONE, WATER, STATIC_STONE]
