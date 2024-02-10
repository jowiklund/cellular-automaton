import { AIR } from "./materials"
import { Entity, Material } from "./types"

export function parseHexTriplet(hex: string): [number, number, number] {
  const pattern = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/
  const result = pattern.exec(hex)
  if (!result) return [0,0,0]
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ]
}

function numberToHex(value?: number) {
  if (!value) return `00`;
  const str = value.toString(16)
  return str.length === 1 ? `0${str}` : str;
}

export function hexToEntity(hex: string, materials: Material[]): Entity {
  const [id, temperature, velocity] = parseHexTriplet(hex)
  const material = materials.find(item => item.id === id) || AIR;
  
  return {
    material,
    state: {
      temperature,
      velocity
    }
  }
}

export function entityToHex(entity: Entity): string {
  const id = numberToHex(entity.material.id)
  const temperature = numberToHex(entity.state.temperature)
  const velocity = numberToHex(entity.state.velocity)
  return `${id}${temperature}${velocity}`
}

export const createMaterial = (id: number, materials: Material[], temperature?: number): string => {
  const material = materials.find(item => item.id === id) || AIR
  return `${numberToHex(id)}${numberToHex(temperature || material.initialHeat)}00`
}

export const clamp = (number: number, min: number, max: number) => Math.max(min, Math.min(number, max));
