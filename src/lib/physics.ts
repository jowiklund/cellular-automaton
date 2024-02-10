import { materials } from "./materials";
import { clamp, createMaterial, entityToHex, getRelativePosition, hexToEntity } from "./parsing";
import { RenderBuffer } from "./types";

export const calculatePhysics = (buffer: RenderBuffer) => (
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
          const {material} = entity;

          if (material.heatLoss && Math.random() > 0.5) {
            entity.state.temperature = clamp(entity.state.temperature - material.heatLoss, 0, 255);
            buffer[y][x] = entityToHex(entity)
          }

          if (material.heatConversions) {
            for (let h = 0; h < material.heatConversions.length; h++) {
              const rule = material.heatConversions[h]
              if (entity.state.temperature >= rule[0]) {
                buffer[y][x] = createMaterial(rule[1], materials, entity.state.temperature);
                continue;
              }
            }
          }

          if (material.coldConversions) {
            for (let c = 0; c < material.coldConversions.length; c++) {
              const rule = material.coldConversions[c]
              if (entity.state.temperature <= rule[0]) {
                buffer[y][x] = createMaterial(rule[1], materials, entity.state.temperature);
                continue;
              }
            }
          }

          const neighbors = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
          ];

          if (entity.state.temperature > 0) {
            for (let n = 0; n < neighbors.length; n++) {
              const [nY, nX] = neighbors[n];
              const pos = getRelativePosition(buffer, y, x, {y: nY, x: nX});
              if (pos.x === x && pos.y === y) continue;
              const nEntity = hexToEntity(buffer[pos.y][pos.x], materials)
              if (nEntity.material.type === "staticMaterial" && !nEntity.material.isVisible) continue;
              if (nEntity.state.temperature >= entity.state.temperature) continue;
              if (entity.material.id === nEntity.material.id) {
                nEntity.state.temperature = entity.state.temperature;
                continue;
              }
              nEntity.state.temperature = clamp(nEntity.state.temperature + Math.floor(entity.state.temperature * 0.8), 0, 255)
              buffer[pos.y][pos.x] = entityToHex(nEntity)
              entity.state.temperature = Math.floor(entity.state.temperature * 0.2);
              buffer[y][x] = entityToHex(entity)
            }
          }

          if (material.contactConversions) {
            for (let c = 0; c < material.contactConversions.length; c++) {
              for (let n = 0; n < neighbors.length; n++) {
                const [nY, nX] = neighbors[n];
                const pos = getRelativePosition(buffer, y, x, {y: nY, x: nX});
                if (pos.x === x && pos.y === y) continue;
                const nEntity = hexToEntity(buffer[pos.y][pos.x], materials)
                const [contactWith, convertToMaterial] = material.contactConversions[c]
                if (nEntity.material.id === contactWith) {
                  buffer[y][x] = createMaterial(convertToMaterial, materials, entity.state.temperature)
                  if (Math.random() > 0.6) {
                    buffer[pos.y][pos.x] = createMaterial(0, materials)
                  }
                  break;
                }
              }
            }
          }

          if (Math.random() > 0.9) continue;
          if (material.type === "staticMaterial" && !material.isVisible) continue;
          if (material.type === "physicsMaterial") {
            const rules = material.attemptToFill;
            if (!buffer[y + 1]) continue;

            for (let p = 0; p < rules.length; p++) {
              const [newY, newX] = rules[p]
              const pos = getRelativePosition(buffer, y, x, {y: newY, x: newX})

              const occupiedBy = hexToEntity(buffer[pos.y][pos.x], materials)

              if (occupiedBy.material.type === "physicsMaterial") {
                if (occupiedBy.material.subtype.type === "liquid") {
                  if (occupiedBy.material.mass < material.mass) {
                    buffer[y][x] = entityToHex(occupiedBy);
                    buffer[pos.y][pos.x] = entityToHex(entity)
                    break;
                  }
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

