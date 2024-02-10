import { AIR } from "./materials"
import { Entity, Material, RenderBuffer } from "./types"

export const getRelativePosition = (buffer: RenderBuffer, y: number, x: number, lookAhead: {x: number, y: number}) => {
  let newY = y + lookAhead.y
  let newX = x + lookAhead.x

  if (newY + lookAhead.y > buffer.length - 1) {
    newY = buffer.length - 1;
  }

  if ((newY + lookAhead.y) < 0) {
    newY = 0;
  }

  if (newX + lookAhead.x > buffer[y].length - 1) {
    newX = buffer[y].length - 1
  }

  if (newX + lookAhead.x < 0) {
    newX = 0
  }

  return { x: newX, y: newY }
}



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
  return `${numberToHex(id)}${numberToHex(temperature || material.initialTemp)}00`
}

export const clamp = (number: number, min: number, max: number) => Math.max(min, Math.min(number, max));
