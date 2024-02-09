import { materials } from "./materials";
import { calculatePhysics } from "./physics";
import { RenderBuffer } from "./types";

type CTX = CanvasRenderingContext2D;

let lastTime = 0;
let interval = 1000/120;
let timer = 0;

const createRenderer = (ctx: CTX, width: number, height: number, timeStamp: number) => (buffer: RenderBuffer) => {
  const deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  if (timer > interval) {
    ctx.clearRect(0, 0, width, height)
    const size = 10;
    for (let r = 0; r < buffer.length; r++) {
      for (let c = 0; c < buffer[r].length; c++) {
        const material = materials[buffer[r][c]]
        if (material.type === "staticMaterial" && !material.isVisible) continue;
        const [red,green,blue] = material.color;
        ctx.beginPath();
        ctx.fillStyle = `rgb(${red},${green},${blue})`
        ctx.fillRect(c * size, r * size, size, size)
      }
    }
  } else {
    timer += deltaTime
  }
  requestAnimationFrame((t) => createRenderer(ctx, width, height, t)(buffer))
}

export function run(ctx: CTX, width: number, height: number) {
  const resolution = 10;
  const getRes = (resolution: number, value: number) => Math.floor(value/resolution)
  const buffer = [...Array(getRes(resolution, height))].map((_) => Array(getRes(resolution, width)).fill(0))

  const draw = (e: MouseEvent) => {
    const x = Math.floor(e.x / resolution);
    const y = Math.floor(e.y / resolution);
    buffer[y-1][x] = parseInt(window.material);
    buffer[y][x] = parseInt(window.material)
    buffer[y][x+1] = parseInt(window.material)
    buffer[y][x-1] = parseInt(window.material)
    buffer[y+1][x] = parseInt(window.material)
  }

  window.addEventListener("mousedown", (e) => {
    draw(e)
    window.addEventListener("mousemove", draw)
  })
  window.addEventListener("mouseup", () => {
    window.removeEventListener("mousemove", draw)
  })

  calculatePhysics(buffer)(0)
  const render = createRenderer(ctx, width, height, 0)
  render(buffer)
}
