export type RenderBuffer = string[][];

export type MaterialState = `${number},${number},${number}`

type RGB = [number, number, number];

export type PhysicsMaterialSubtype = Solid | Liquid | Gas

export type MaterialBase = {
  id: number,
  color: RGB,
  name: string,
  conductivity: number
  maxHeatColor?: RGB
  heatConversions?: [temp: number, materialId: number][]
  coldConversions?: [temp: number, materialId: number][]
  reactons?: [contactWith: number, creates: number, chance: number][]
  heatRetention?: number
  initialTemp?: number
  maxColorTemp?: number
  minColorTemp?: number
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
  density: number
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
    seed: number
  }
}
