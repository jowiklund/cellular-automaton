import { materials } from "./materials";
import { createMaterial } from "./util";
import { calculatePhysics } from "./physics";
import { RenderBuffer } from "./types";
import { Entity as ECS_Entity, IdComponent, PixelsComponent, PositionComponent, createPointer, createUpdater } from "./ecs";
import { EntityDB, MaterialEntity, createQuery, createSpawner } from "./ecs";
import { Smiley } from "./entities";

type CTX = CanvasRenderingContext2D;

function colorChannelMixer(colorChannelA: number, colorChannelB: number, amountToMix: number){
    const channelA: number = colorChannelA*amountToMix;
    const channelB: number = colorChannelB*(1-amountToMix);
    return Math.floor(channelA + channelB);
}

function colorMixer(rgbA: number[], rgbB: number[], amountToMix: number){
    const r = colorChannelMixer(rgbA[0],rgbB[0],amountToMix);
    const g = colorChannelMixer(rgbA[1],rgbB[1],amountToMix);
    const b = colorChannelMixer(rgbA[2],rgbB[2],amountToMix);
    return [r,g,b]
}

let lastTime = 0;
let interval = 1000/60;
let timer = 0;

const writeToBuffer = (db: EntityDB, buffer: RenderBuffer) => {
  const query = createQuery(db)
  for (let i = 0; i < db.length; i++) {
    const entity = db[i]
    const pos = entity.find(i => i.type === "position")
    if (!pos || pos.type !== "position") continue;
    for (let e = 0; e < entity.length; e++) {
      const component = entity[e]
      switch(component.type) {
        case "temperature":
        case "material":
        case "velocity":
        case "sprite":
        case "id":
      }
    }
  }
}

const renderEntityBoundary = (ctx: CTX, resolution: number, entity: ECS_Entity) => {
  const pos = entity.find(e => e.type === "position") as PositionComponent
  const pixels = entity.find(e => e.type === "pixels") as PixelsComponent
  if (!pos || !pixels) return;
  ctx.strokeStyle = "aqua"
  ctx.moveTo(pos.x * resolution, pos.y * resolution);
  ctx.lineTo(pos.x * resolution, pos.y * resolution - pixels.data.length * resolution);
  ctx.closePath();
  ctx.stroke();

  ctx.moveTo(pos.x * resolution, pos.y * resolution);
  ctx.lineTo(pos.x * resolution + pixels.data[0].length * resolution, pos.y * resolution);
  ctx.closePath();
  ctx.stroke();

  ctx.moveTo(pos.x * resolution, pos.y * resolution);
  ctx.lineTo(pos.x * resolution + pixels.data[0].length * resolution, pos.y * resolution - pixels.data.length * resolution);
  ctx.closePath();
  ctx.stroke();

  ctx.moveTo(pos.x * resolution + pixels.data[0].length * resolution, pos.y * resolution);
  ctx.lineTo(pos.x * resolution + pixels.data[0].length * resolution, pos.y * resolution - pixels.data.length * resolution);
  ctx.closePath();
  ctx.stroke();

  ctx.moveTo(pos.x * resolution + pixels.data[0].length * resolution, pos.y * resolution - pixels.data.length * resolution);
  ctx.lineTo(pos.x * resolution, pos.y * resolution - pixels.data.length * resolution);
  ctx.closePath();
  ctx.stroke();
}

type RendererConfig = {
  boundaries: boolean
}

const renderPixelsComponent = (ctx: CTX, resolution: number, pos: PositionComponent, pixels: PixelsComponent) => {
  for (let prow = 0; prow < pixels.data.length; prow++) {
    for (let pcol = 0; pcol < pixels.data[prow].length; pcol++) {
      const [red, green, blue, alpha] = pixels.data[prow][pcol]
      ctx.fillStyle = `rgba(${red},${green},${blue},${alpha})`
      const x = pos.x + pcol
      const y = pos.y + prow
      ctx.fillRect(x * resolution, y * resolution - (pixels.data.length * resolution), resolution, resolution)
    }
  }
}

const createRenderer = (ctx: CTX, resolution: number, config: RendererConfig = {
  boundaries: false
}) => (entity: ECS_Entity) => {
    const pos = entity.find(e => e.type === "position") as PositionComponent
    const pixels = entity.find(e => e.type === "pixels") as PixelsComponent
    if (!pos) return;
    ctx.beginPath();
    if (pixels) renderPixelsComponent(ctx, resolution, pos, pixels)

    if (config.boundaries) {
      renderEntityBoundary(ctx, resolution, entity)
    }
  }

const createMaterialE = (id: number, x: number, y: number): MaterialEntity => [
  {type: "material", id},
  {type: "position", x, y},
  {type: "pixels", data: [
    [[130,130,10,1]]
  ]}
]
const createRendererProcess = (ctx: CTX, width: number, height: number, resolution: number, timeStamp: number) => (db: EntityDB) => {
  const render = createRenderer(ctx, resolution, {
    boundaries: false
  })
  const deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  if (timer > interval) {
    ctx.clearRect(0, 0, width, height)
    db.forEach(e => render(e))
    timer = 0;
    // for (let y = 0; y < buffer.length; y++) {
    //   for (let x = 0; x < buffer[y].length; x++) {
    //     const entity = hexToEntity(buffer[y][x], materials)
    //     if (entity.material.type === "staticMaterial" && !entity.material.isVisible) continue;
    //     ctx.beginPath();
    //     if (entity.material.maxHeatColor && entity.state.temperature >= 0) {
    //       const newColor = colorMixer(
    //         entity.material.maxHeatColor,
    //         entity.material.color,
    //         clamp(entity.state.temperature - (entity.material.minColorTemp || 0), 0, MAX_INT) / (entity.material.maxColorTemp || MAX_INT))
    //       const [red,green,blue] = newColor;
    //       ctx.fillStyle = `rgb(${red},${green},${blue})`
    //     } else {
    //       const [red,green,blue] = entity.material.color;
    //       ctx.fillStyle = `rgb(${red},${green},${blue})`
    //     }
    //     ctx.fillRect(x * resolution, y * resolution, resolution, resolution)
    //   }
    // }
  } else {
    timer += deltaTime
  }
  requestAnimationFrame((t) => createRendererProcess(ctx, width, height, resolution, t)(db))
}

export function run(ctx: CTX, width: number, height: number) {
  const resolution = 5;
  const getRes = (resolution: number, value: number) => Math.floor(value/resolution)
  const buffer = [...Array(getRes(resolution, height))].map((_) => Array(getRes(resolution, width)).fill(createMaterial(0, materials)))
  const entities: EntityDB = []
  const spawn = createSpawner(entities)

  spawn([
    {type: "id", value: 1},
    {type: "position", x: 50, y: 100},
    Smiley
  ])

  spawn([
    {type: "id", value: 2},
    {type: "position", x: 100, y: 50},
    {type: "velocity", x: 10, y: 1},
    Smiley
  ])

  const materialSelector = document.querySelector("#material") as HTMLInputElement;

  materials.forEach((m) => {
    const el = document.createElement("option")
    el.innerHTML = `${m.name}`
    el.value = `${m.id}`
    materialSelector?.appendChild(el)
  })

  let material: string = createMaterial(0, materials);
  materialSelector?.addEventListener("change", () => {
    material = createMaterial(parseInt(materialSelector.value), materials);
  })

  const query = createQuery(entities)
  const update = createUpdater(entities, query)
  const point = createPointer(entities)
  let selected: ECS_Entity = []

  console.log(query([
    {type: "id", value: 1},
    {type: "position", x: 50, y: 100}
  ]))

  const draw = (e: MouseEvent) => {
    const x = Math.floor(e.x / resolution);
    const y = Math.floor(e.y / resolution);
    const size = 5;
    const radius = Math.floor(size / 2)
    for (let col = -radius; col <= radius; col++) {
      for (let row = -radius; row <= radius; row++) {
        let colCoordinate = x + col
        let rowCoordinate = y + row
        if (colCoordinate > 0 && colCoordinate < buffer[0].length - 1 && rowCoordinate > 0 && rowCoordinate < buffer.length - 1) {
          spawn(createMaterialE(2, colCoordinate, rowCoordinate))
          buffer[rowCoordinate][colCoordinate] = material;
        }
      }
    }
  }

  const move = (e: MouseEvent) => {
    const x = Math.round(e.x / resolution * 100) / 100;
    const y = Math.round(e.y / resolution * 100) / 100;
    selected = point(x, y);
    const id = selected.find(i => i.type === "id") as IdComponent
    const pixels = selected.find(i => i.type === "pixels") as PixelsComponent
    const pos = selected.find(i => i.type === "position") as PositionComponent
    if (id && pixels && pos) {
      if (x <= pos.x + pixels.data[0].length && x >= pos.x && y <= pos.y && y >= pos.y - pixels.data.length) {
        update([id], (data) => {
          return data.map(e => e.type === "position" ? ({...e, y: y + pixels.data.length / 2, x: x - pixels.data[0].length / 2}) : (e))
        })
      }
    }
  }

  window.addEventListener("mousedown", (e) => {
    move(e)
    window.addEventListener("mousemove", move)
  })

  window.addEventListener("mouseup", () => {
    window.removeEventListener("mousemove", move)
  })

  calculatePhysics(entities, materials, Math.floor(width / resolution), Math.floor(height / resolution))(0)
  const runRendererProcess = createRendererProcess(ctx, width, height, resolution, 0)
  runRendererProcess(entities)
}
