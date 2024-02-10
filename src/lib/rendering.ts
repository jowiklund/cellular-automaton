import { materials } from "./materials";
import { createMaterial, hexToEntity } from "./parsing";
import { calculatePhysics } from "./physics";
import { RenderBuffer, Material } from "./types";

type CTX = CanvasRenderingContext2D;

let lastTime = 0;
let interval = 1000/120;
let timer = 0;

function colorChannelMixer(colorChannelA: number, colorChannelB: number, amountToMix: number){
    const channelA: number = colorChannelA*amountToMix;
    const channelB: number = colorChannelB*(1-amountToMix);
    return Math.floor(channelA + channelB);
}
//rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0
//example (red): rgbA = [255,0,0]
function colorMixer(rgbA: number[], rgbB: number[], amountToMix: number){
    const r = colorChannelMixer(rgbA[0],rgbB[0],amountToMix);
    const g = colorChannelMixer(rgbA[1],rgbB[1],amountToMix);
    const b = colorChannelMixer(rgbA[2],rgbB[2],amountToMix);
    return [r,g,b]
}

const createRenderer = (ctx: CTX, width: number, height: number, resolution: number, timeStamp: number) => (buffer: RenderBuffer) => {
  const deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  if (timer > interval) {
    ctx.clearRect(0, 0, width, height)
    for (let y = 0; y < buffer.length; y++) {
      for (let x = 0; x < buffer[y].length; x++) {
        const entity = hexToEntity(buffer[y][x], materials)
        if (entity.material.type === "staticMaterial" && !entity.material.isVisible) continue;
        ctx.beginPath();
        if (entity.material.maxHeatColor && entity.state.temperature >= 0) {
          const newColor = colorMixer(entity.material.maxHeatColor,entity.material.color, entity.state.temperature / 255)
          const [red,green,blue] = newColor;
          ctx.fillStyle = `rgb(${red},${green},${blue})`
        } else {
          const [red,green,blue] = entity.material.color;
          ctx.fillStyle = `rgb(${red},${green},${blue})`
        }
        ctx.fillRect(x * resolution, y * resolution, resolution, resolution)
      }
    }
  } else {
    timer += deltaTime
  }
  requestAnimationFrame((t) => createRenderer(ctx, width, height, resolution, t)(buffer))
}

export function run(ctx: CTX, width: number, height: number) {
  const resolution = 8;
  const getRes = (resolution: number, value: number) => Math.floor(value/resolution)
  const buffer = [...Array(getRes(resolution, height))].map((_) => Array(getRes(resolution, width)).fill(createMaterial(0, materials)))

  const materialSelector = document.querySelector("#material") as HTMLInputElement;

  materials.forEach((m, index) => {
    const el = document.createElement("option")
    el.innerHTML = `${m.name}`
    el.value = `${m.id}`
    materialSelector?.appendChild(el)
  })

  let material: string = createMaterial(0, materials);
  materialSelector?.addEventListener("change", () => {
    material = createMaterial(parseInt(materialSelector.value), materials);
  })

  const draw = (e: MouseEvent) => {
    let size = 3;
    const x = Math.floor(e.x / resolution);
    const y = Math.floor(e.y / resolution);
    buffer[y-1][x] = material;
    buffer[y][x] = material
    buffer[y][x+1] = material
    buffer[y][x-1] = material
    buffer[y+1][x] = material
  }

  window.addEventListener("mousedown", (e) => {
    draw(e)
    window.addEventListener("mousemove", draw)
  })
  window.addEventListener("mouseup", () => {
    window.removeEventListener("mousemove", draw)
  })

  calculatePhysics(buffer)(0)
  const render = createRenderer(ctx, width, height, resolution, 0)
  render(buffer)
}
