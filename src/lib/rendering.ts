import { materials } from "./materials";
import { createMaterial, hexToEntity, halfBuffer, clamp, seedPercentage } from "./util";
import { calculatePhysics } from "./physics";
import { Entity, RenderBuffer } from "./types";
import { Entity as ECS_Entity, PixelsComponent, PositionComponent, createPointer, createUpdater } from "./ecs";
import { MAX_INT } from "./constants";
import { EntityDB, MaterialEntity, createQuery, createSpawner } from "./ecs";

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
    boundaries: true
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
  const resolution = 6;
  const getRes = (resolution: number, value: number) => Math.floor(value/resolution)
  const buffer = [...Array(getRes(resolution, height))].map((_) => Array(getRes(resolution, width)).fill(createMaterial(0, materials)))
  const entities: EntityDB = []
  const spawn = createSpawner(entities)
  spawn([
    {type: "id", value: 1},
    {type: "position", x: 50, y: 100},
    {type: "pixels", data: [
      [[235, 174, 52,0],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,0]],
      [[235, 174, 52,1],[235, 174, 52,1],[0,0,0,1],[235, 174, 52,1],[0,0,0,1],[235, 174, 52,1],[235, 174, 52,1]],
      [[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1]],
      [[235, 174, 52,1],[0,0,0,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[0,0,0,1],[235, 174, 52,1]],
      [[235, 174, 52,1],[235, 174, 52,1],[0,0,0,1],[0,0,0,1],[0,0,0,1],[235, 174, 52,1],[235, 174, 52,1]],
      [[235, 174, 52,0],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,0]],
    ]}
  ])

  spawn([
    {type: "id", value: 2},
    {type: "position", x: 100, y: 50},
    {type: "pixels", data: [
      [[235, 174, 52,0],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,0]],
      [[235, 174, 52,1],[235, 174, 52,1],[0,0,0,1],[235, 174, 52,1],[0,0,0,1],[235, 174, 52,1],[235, 174, 52,1]],
      [[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1]],
      [[235, 174, 52,1],[0,0,0,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[0,0,0,1],[235, 174, 52,1]],
      [[235, 174, 52,1],[235, 174, 52,1],[0,0,0,1],[0,0,0,1],[0,0,0,1],[235, 174, 52,1],[235, 174, 52,1]],
      [[235, 174, 52,0],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,1],[235, 174, 52,0]],
    ]}
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
  const draw = (e: MouseEvent) => {
    const x = Math.floor(e.x / resolution);
    const y = Math.floor(e.y / resolution);
    selected = point(x, y);
    const id = selected.find(i => i.type === "id")
    if (id) {
      update([id], (data) => {
        return data.map(e => e.type === "position" ? ({...e, y, x}) : (e))
      })
    }

    // const size = 5;
    // const radius = Math.floor(size / 2)
    // for (let col = -radius; col <= radius; col++) {
    //   for (let row = -radius; row <= radius; row++) {
    //     let colCoordinate = x + col
    //     let rowCoordinate = y + row
    //     if (colCoordinate > 0 && colCoordinate < buffer[0].length - 1 && rowCoordinate > 0 && rowCoordinate < buffer.length - 1) {
    //       spawn(createMaterialE(2, colCoordinate, rowCoordinate))
    //       buffer[rowCoordinate][colCoordinate] = material;
    //     }
    //   }
    // }
  }

  window.addEventListener("mousedown", (e) => {
    draw(e)
    window.addEventListener("mousemove", draw)
  })
  window.addEventListener("mouseup", () => {
    window.removeEventListener("mousemove", draw)
  })

  calculatePhysics(buffer, materials)(0)
  const runRendererProcess = createRendererProcess(ctx, width, height, resolution, 0)
  runRendererProcess(entities)
}
