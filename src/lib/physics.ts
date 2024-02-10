import { clamp, createMaterial, entityToHex, getRelativePosition, hexToEntity } from "./util";
import { Entity, Material, RenderBuffer } from "./types";

const createWriter = (buffer: RenderBuffer) => (y: number, x: number, hex: string): void => {
  buffer[y][x] = hex;
}

const createReader = (buffer: RenderBuffer, materials: Material[]) => (y: number, x: number): Entity => {
  return hexToEntity(buffer[y][x], materials)
}

function doHeatDissipation(
  buffer: RenderBuffer,
  x: number,
  y: number,
  entity: Entity,
  neighbors: [number,number][],
  materials: Material[]
) {
  if (entity.state.temperature === 0) return;
  const read = createReader(buffer, materials)
  const write = createWriter(buffer)
  for (let n = 0; n < neighbors.length; n++) {
    const [nY, nX] = neighbors[n];
    const neighborPosition = getRelativePosition(buffer, y, x, {y: nY, x: nX});

    if (neighborPosition.x === x && neighborPosition.y === y) continue;

    const neighbor = read(neighborPosition.y, neighborPosition.x)

    if (neighbor.material.type === "staticMaterial" && !neighbor.material.isVisible) continue;

    if (neighbor.state.temperature >= entity.state.temperature) continue;

    if (entity.material.conductivity === neighbor.material.conductivity) {
      neighbor.state.temperature = entity.state.temperature;
      continue;
    }

    const conductivity = neighbor.material.conductivity / 255;
    neighbor.state.temperature = clamp(neighbor.state.temperature + Math.floor(entity.state.temperature * conductivity), 0, 255)
    write(neighborPosition.y, neighborPosition.x, entityToHex(neighbor))

    entity.state.temperature = clamp(Math.floor(entity.state.temperature * (1 - conductivity)), 0, 255);
    write(y, x, entityToHex(entity))
  }

  if (entity.material.heatRetention !== undefined && Math.random() > entity.material.heatRetention / 255) {
    entity.state.temperature = clamp(Math.floor(entity.state.temperature * (entity.material.heatRetention / 255)), 0, 255);
    write(y, x, entityToHex(entity))
  }
}

function doReactons(
  buffer: RenderBuffer,
  x: number,
  y: number,
  entity: Entity,
  neighbors: [number, number][],
  materials: Material[]
) {
  const write = createWriter(buffer)
  const read = createReader(buffer, materials)

  const { material } = entity;
  if (!material.reactons) return;
  for (let c = 0; c < material.reactons.length; c++) {
    for (let n = 0; n < neighbors.length; n++) {
      const [nY, nX] = neighbors[n];
      const neighborPosition = getRelativePosition(buffer, y, x, {y: nY, x: nX});

      if (neighborPosition.x === x && neighborPosition.y === y) continue;

      const neighbor = read(neighborPosition.y, neighborPosition.x)
      const [contacting, convertTo] = material.reactons[c]

      if (contacting === neighbor.material.id) {
        write(y, x, createMaterial(convertTo, materials, entity.state.temperature))
        if (Math.random() > 0.6) {
          write(neighborPosition.y, neighborPosition.x, createMaterial(0, materials))
        }
        break;
      }
    }
  }
}

function doHeatConversions(buffer: RenderBuffer, y: number, x: number, entity: Entity, materials: Material[]) {
  const { material } = entity;
  if (!material.heatConversions) return;
  for (let i = 0; i < material.heatConversions.length; i++) {
    const rule = material.heatConversions[i]
    if (entity.state.temperature >= rule[0]) {
      buffer[y][x] = createMaterial(rule[1], materials, entity.state.temperature);
      continue;
    }
  }
}

function doColdConversions(buffer: RenderBuffer, y: number, x: number, entity: Entity, materials: Material[]) {
  const { material } = entity;
  if (!material.coldConversions) return;
  for (let i = 0; i < material.coldConversions.length; i++) {
    const rule = material.coldConversions[i]
    if (entity.state.temperature <= rule[0]) {
      buffer[y][x] = createMaterial(rule[1], materials, entity.state.temperature);
      continue;
    }
  }
}

export const calculatePhysics = (buffer: RenderBuffer, materials: Material[]) => (
  timeStamp: number,
  lastTime: number = 0,
  interval: number = 1000/120,
  timer: number = 0) => {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    console.log(Math.floor(1000 / deltaTime))
    if (timer > interval) {
      for (let y = 0; y < buffer.length; y++) {
        for (let x = 0; x < buffer[y].length; x++) {
          const entity = hexToEntity(buffer[y][x], materials)
          const { material } = entity;
          if (material.type === "staticMaterial" && !material.isVisible) continue;

          const neighbors: [number,number][] = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
          ];

          doHeatDissipation(buffer, x, y, entity, neighbors, materials)

          doColdConversions(buffer, y, x, entity, materials);
          doHeatConversions(buffer, y, x, entity, materials);

          doReactons(buffer, x, y, entity, neighbors, materials)

          if (Math.random() > 0.9) continue;


          if (material.type === "physicsMaterial") {
            const rules = material.attemptToFill;
            if (!buffer[y + 1]) continue;

            for (let p = 0; p < rules.length; p++) {
              const [newY, newX] = rules[p]
              const pos = getRelativePosition(buffer, y, x, {y: newY, x: newX})

              const occupied = hexToEntity(buffer[pos.y][pos.x], materials)

              if (occupied.material.type === "physicsMaterial") {
                if (occupied.material.subtype.type === "liquid" || occupied.material.subtype.type === "gas") {
                  if (occupied.material.density < material.density) {
                    buffer[y][x] = entityToHex(occupied);
                    buffer[pos.y][pos.x] = entityToHex(entity)
                    break;
                  }
                }
              }

              if (occupied.material.type === "staticMaterial" && !occupied.material.isVisible) {
                buffer[y][x] = createMaterial(0, materials);
                buffer[pos.y][pos.x] = entityToHex(entity);
                break;
              }
            }
          }
        }
      }
    } else {
      timer += deltaTime;
    }
    requestAnimationFrame(t => calculatePhysics(buffer, materials)(t, lastTime, interval, timer))
  }

