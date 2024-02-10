import { materials } from "./materials";
import { createMaterial, hexToEntity } from "./parsing";
import { calculatePhysics } from "./physics";
import { RenderBuffer, Material } from "./types";

type CTX = CanvasRenderingContext2D;

let lastTime = 0;
let interval = 1000/120;
let timer = 0;

const createRenderer = (ctx: CTX, width: number, height: number, resolution: number, timeStamp: number) => (buffer: RenderBuffer) => {
  const deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  if (timer > interval) {
    ctx.clearRect(0, 0, width, height)
    for (let r = 0; r < buffer.length; r++) {
      for (let c = 0; c < buffer[r].length; c++) {
        const entity = hexToEntity(buffer[r][c], materials)
        if (entity.material.type === "staticMaterial" && !entity.material.isVisible) continue;
        const [red,green,blue] = entity.material.color;
        ctx.beginPath();
        ctx.fillStyle = `rgb(${red},${green},${blue})`
        ctx.fillRect(c * resolution, r * resolution, resolution, resolution)
      }
    }
  } else {
    timer += deltaTime
  }
  requestAnimationFrame((t) => createRenderer(ctx, width, height, resolution, t)(buffer))
}

export function run(ctx: CTX, width: number, height: number) {
  const resolution = 5;
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
    console.log(hexToEntity(material, materials))
    console.log(material)
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
