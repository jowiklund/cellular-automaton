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
  const pattern = /([a-f\d]{4})([a-f\d]{4})([a-f\d]{4})/
  const result = pattern.exec(hex)
  if (!result) return [0,0,0]
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ]
}

function numberToHex(value?: number) {
  if (!value) return `0000`;
  const str = value.toString(16)
  switch(str.length) {
    case 4:
      return str
    case 3:
      return `0${str}`
    case 2:
      return `00${str}`
    case 1:
      return `000${str}`
  }
  return str;
}

export function hexToEntity(hex: string, materials: Material[]): Entity {
  const [id, temperature, seed] = parseHexTriplet(hex)
  const material = materials.find(item => item.id === id) || AIR;
  
  return {
    material,
    state: {
      temperature,
      seed
    }
  }
}

export function entityToHex(entity: Entity): string {
  const id = numberToHex(entity.material.id)
  const temperature = numberToHex(entity.state.temperature)
  const seed = numberToHex(entity.state.seed)
  return `${id}${temperature}${seed}`
}

export const createMaterial = (id: number, materials: Material[], temperature?: number): string => {
  const material = materials.find(item => item.id === id) || AIR
  return `${numberToHex(id)}${numberToHex(temperature || material.initialTemp)}${numberToHex(Math.floor(Math.random() * 9999))}`
}

export const seedPercentage = (seed: number) => seed / 9999;

export const clamp = (number: number, min: number, max: number) => Math.max(min, Math.min(number, max));

export function halfBuffer(buffer: RenderBuffer) {
  let scaledBuffer = []
  for (let i = 0; i < buffer.length; i++) {
    const row = buffer[i] 
    if (i % 2 !== 0) continue;
    let newRow = []
    for (let r = 0; r < row.length; r++) {
      if (r % 2 === 0) {
        newRow.push(row[r])
      }
    }
    scaledBuffer.push(newRow)
  }
  return scaledBuffer;
}
