export type RenderBuffer = string[][];

export type MaterialState = `${number},${number},${number}`

export type MaterialBase = {
  id: number,
  color: [number, number, number],
  name: string,
  temperatureConversion?: [temp: number, materialId: number]
  heatTransfer?: number
  heatLoss?: number
  initialHeat?: number
}

export type PhysicsMaterial = MaterialBase & {
  type: "physicsMaterial"
  mass: number
  attemptToFill: [ y: number, x:number ][]
}

export type Solid = PhysicsMaterial & {
  subtype: "solid"
  friction: number
}

export type Liquid = PhysicsMaterial & {
  subtype: "liquid"
  viscosity: number
  density: number
}

export type Gas = PhysicsMaterial & {
  subtype: "gas"
  density: number
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
