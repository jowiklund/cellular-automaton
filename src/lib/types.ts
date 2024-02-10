export type RenderBuffer = string[][];

export type MaterialState = `${number},${number},${number}`

type RGB = [number, number, number];

export type PhysicsMaterialSubtype = Solid | Liquid | Gas

export type MaterialBase = {
  id: number,
  color: RGB,
  maxHeatColor?: RGB,
  name: string,
  heatConversions?: [temp: number, materialId: number][]
  coldConversions?: [temp: number, materialId: number][]
  contactConversions?: [contactWith: number, creates: number][]
  heatTransfer?: number
  heatLoss?: number
  initialTemp?: number
}

type Solid = {
  type: "solid",
  friction: number
}

type Liquid = {
  type: "liquid"
  viscosity: number
}

type Gas = {
  type: "gas"
}

export type PhysicsMaterial = MaterialBase & {
  type: "physicsMaterial"
  mass: number
  attemptToFill: [ y: number, x:number ][]
  subtype: PhysicsMaterialSubtype
}

export type StaticMaterial = MaterialBase & {
  type: "staticMaterial"
  isVisible: boolean
  color: [number, number, number],
}

export type Material = PhysicsMaterial | StaticMaterial

export type Entity = {
  material: Material,
  state: {
    temperature: number,
    velocity: number
  }
}
