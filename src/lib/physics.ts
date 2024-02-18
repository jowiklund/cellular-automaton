import { clamp, createMaterial, entityToHex, getRelativePosition, hexToEntity } from "./util";
import { Entity, Material, RenderBuffer } from "./types";
import { AMBIANCE, MAX_INT } from "./constants";
import { EntityDB, VelocityComponent, createQuery, createUpdater } from "./ecs";

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
  for (let i = 0; i < neighbors.length; i++) {
    const [nY, nX] = neighbors[i];
    const nPosition = getRelativePosition(buffer, y, x, {y: nY, x: nX});

    if (nPosition.x === x && nPosition.y === y) continue;

    const n = read(nPosition.y, nPosition.x)

    if (n.state.temperature > entity.state.temperature) continue;

    const nC = n.material.conductivity / MAX_INT;

    const heatTransfer = Math.floor(Math.sqrt(entity.state.temperature * nC));

    entity.state.temperature = clamp(entity.state.temperature - heatTransfer, AMBIANCE, MAX_INT);
    write(y, x, entityToHex(entity))

    n.state.temperature = clamp(n.state.temperature + heatTransfer, 0, MAX_INT)
    write(nPosition.y, nPosition.x, entityToHex(n))
  }

  if (entity.material.heatRetention !== undefined && Math.random() > entity.material.heatRetention / MAX_INT) {
    if (entity.state.temperature > AMBIANCE) {
      entity.state.temperature = clamp(Math.floor(entity.state.temperature - Math.sqrt(entity.state.temperature * entity.material.heatRetention / MAX_INT)), AMBIANCE, MAX_INT);
    } else {
      entity.state.temperature = clamp(entity.state.temperature + Math.floor(Math.sqrt(AMBIANCE - entity.state.temperature)), 0, MAX_INT)
    }
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
      const [contacting, convertTo, chance] = material.reactons[c]

      if (contacting === neighbor.material.id && Math.random() < chance) {
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

export const calculatePhysics = (db: EntityDB, materials: Material[]) => (
  timeStamp: number,
  lastTime: number = 0,
  slowTickTimer: number = 0,
  fastTickTimer: number = 0) => {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    const slowTick: number = 1000 / 10;
    const fastTick: number = 1000 / 60;
    const query = createQuery(db)
    const update = createUpdater(db, query)

    const neighbors: [number,number][] = [
      [1, 0],
      [0, -1],
      [-1, 0],
      [0, 1],
    ];

    // if (slowTickTimer > slowTick) {
    //   slowTickTimer = 0;
    //   for (let y = 0; y < buffer.length; y++) {
    //     for (let x = 0; x < buffer[y].length; x++) {
    //       const entity = hexToEntity(buffer[y][x], materials)
    //       const { material } = entity;
    //       if (material.type === "staticMaterial" && !material.isVisible) continue;
    //
    //       doHeatDissipation(buffer, x, y, entity, neighbors, materials)
    //
    //       doColdConversions(buffer, y, x, entity, materials);
    //       doHeatConversions(buffer, y, x, entity, materials);
    //
    //       doReactons(buffer, x, y, entity, neighbors, materials)
    //
    //     }
    //   }
    // } else {
    //   slowTickTimer += deltaTime
    // }

    if (fastTickTimer > fastTick) {
      fastTickTimer = 0;
      for (let index = 0; index < db.length; index++) {
        const entity = db[index]
        const velocity = entity.find(i => i.type === "velocity") as VelocityComponent
        if (!velocity) continue;
        update(entity, (data) => {
          const p = data.map(e => e.type === "position"
            ? ({...e,
              y: e.y + velocity.y,
              x: e.x + velocity.x
            })
            : (e))

          const v = p.map(e => e.type === "velocity"
            ? ({...e, 
              y: clamp(e.y + Math.sqrt(e.y) * 0.3, -10, 10), 
              x: clamp(e.x - Math.sqrt(e.x) * 0.3, 0, 10)
            })
            : (e))
          return v
        })
      }

      // for (let y = 0; y < buffer.length; y++) {
      //   for (let x = 0; x < buffer[y].length; x++) {
      //     if (Math.random() > 0.9) continue;
      //     const entity = hexToEntity(buffer[y][x], materials)
      //     const { material } = entity;
      //     if (material.type === "staticMaterial" && !material.isVisible) continue;
      //
      //     if (material.type === "physicsMaterial") {
      //       const rules = material.attemptToFill;
      //
      //       for (let p = 0; p < rules.length; p++) {
      //         const [newY, newX] = rules[p]
      //         const pos = getRelativePosition(buffer, y, x, {y: newY, x: Math.random() > 0.5 ? newX : newX * -1})
      //
      //         const occupied = hexToEntity(buffer[pos.y][pos.x], materials)
      //
      //         if (occupied.material.type === "physicsMaterial") {
      //           if (occupied.material.subtype.type === "liquid" || occupied.material.subtype.type === "gas") {
      //             if (occupied.material.density < material.density) {
      //               buffer[y][x] = entityToHex(occupied);
      //               buffer[pos.y][pos.x] = entityToHex(entity)
      //               break;
      //             }
      //           }
      //         }
      //
      //         if (occupied.material.type === "staticMaterial" && !occupied.material.isVisible) {
      //           buffer[y][x] = createMaterial(0, materials);
      //           buffer[pos.y][pos.x] = entityToHex(entity);
      //           break;
      //         }
      //       }
      //     }
      //   }
      // }
    } else {
      fastTickTimer += deltaTime;
    }
    requestAnimationFrame(timestamp => calculatePhysics(db, materials)(timestamp, lastTime, slowTickTimer, fastTickTimer))
  }

