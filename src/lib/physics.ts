import { materials } from "./materials";
import { clamp, createMaterial, entityToHex, hexToEntity } from "./parsing";
import { RenderBuffer } from "./types";

const getRelativePosition = (buffer: RenderBuffer, y: number, x: number, lookAhead: {x: number, y: number}) => {
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

export const calculatePhysics = (buffer: RenderBuffer) => (
  timeStamp: number,
  lastTime: number = 0,
  interval: number = 1000/120,
  timer: number = 0) => {
    const deltaTime = timeStamp - lastTime;
    if (timer > interval) {
      for (let y = 0; y < buffer.length; y++) {
        for (let x = 0; x < buffer[y].length; x++) {
          const entity = hexToEntity(buffer[y][x], materials)
          const {material} = entity;
          if (!buffer[y + 1]) continue;
          if (Math.random() > 0.9) continue;
          if (material.type === "staticMaterial" && !material.isVisible) continue;

          if (material.type === "physicsMaterial") {
            const rules = material.attemptToFill;
            for (let p = 0; p < rules.length; p++) {
              const [newY, newX] = rules[p]
              const pos = getRelativePosition(buffer, y, x, {y: newY, x: newX})

              const occupiedBy = hexToEntity(buffer[pos.y][pos.x], materials)

              if (material.heatLoss) {
                if (Math.random() > 0.6) {
                  entity.state.temperature = clamp(entity.state.temperature - material.heatLoss, 0, 255);
                  buffer[y][x] = entityToHex(entity)
                }
              }

              if (material.temperatureConversion) {
                if (entity.state.temperature === material.temperatureConversion[0]) {
                  buffer[y][x] = createMaterial(material.temperatureConversion[1], materials, entity.state.temperature);
                  continue;
                }
              }

              if (material.heatTransfer) {
                occupiedBy.state.temperature = clamp(occupiedBy.state.temperature + entity.state.temperature, 0, 255);
              }

              if (occupiedBy.material.type === "physicsMaterial") {
                if (occupiedBy.material.mass < material.mass) {
                  buffer[y][x] = entityToHex(occupiedBy);
                  buffer[pos.y][pos.x] = entityToHex(entity)
                  break;
                }
              }

              if (occupiedBy.material.type === "staticMaterial" && !occupiedBy.material.isVisible) {
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
    requestAnimationFrame(t => calculatePhysics(buffer)(t, lastTime, interval, timer))
  }

