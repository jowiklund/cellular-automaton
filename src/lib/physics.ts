import { materials } from "./materials";
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
          const material = materials[buffer[y][x]]
          if (!buffer[y + 1]) continue;
          if (Math.random() > 0.9) continue;
          if (material.type === "staticMaterial" && !material.isVisible) continue;

          if (material.type === "physicsMaterial") {
            const rules = material.attemptToFill;
            for (let p = 0; p < rules.length; p++) {
              const [newY, newX] = rules[p]
              const pos = getRelativePosition(buffer, y, x, {y: newY, x: newX})

              const occupiedBy = materials[buffer[pos.y][pos.x]]

              if (occupiedBy.type === "physicsMaterial") {
                if (occupiedBy.mass < material.mass) {
                  buffer[y][x] = materials.indexOf(occupiedBy);
                  buffer[pos.y][pos.x] = materials.indexOf(material);
                  break;
                }
              }

              if (occupiedBy.type === "staticMaterial" && !occupiedBy.isVisible) {
                buffer[y][x] = 0;
                buffer[pos.y][pos.x] = materials.indexOf(material);
                break;
              }
            }

            // if (!buffer[y + 1]) continue;
            // const below = getRelativePosition(buffer, y, x, {y: 1, x: 0})
            // if (buffer[below.y][below.x] === 0) {
            //   buffer[y][x] = 0
            //   buffer[below.y][below.x] = materials.indexOf(material)
            //   continue;
            // }
            //
            // const downLeft = buffer[y+1][x-1]
            // if (downLeft !== undefined) {
            //   if (downLeft === 0) {
            //     buffer[y][x] = 0
            //     buffer[y + 1][x - 1] = materials.indexOf(material)
            //     continue;
            //   }
            // }
            //
            // const downRight = buffer[y+1][x+1]
            // if (downRight !== undefined) {
            //   if (downRight === 0) {
            //     buffer[y][x] = 0
            //     buffer[y + 1][x + 1] = materials.indexOf(material)
            //     continue;
            //   }
            // }
          }
        }
      }
    } else {
      timer += deltaTime;
    }
    requestAnimationFrame(t => calculatePhysics(buffer)(t, lastTime, interval, timer))
  }

