import { materials } from "./lib/materials";
import { run } from "./lib/rendering"

function app() {
  window.onload = function() {
    const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const materialSelector = document.querySelector("#material") as HTMLInputElement;
    Object.assign(window, {material: 0})
    materials.forEach((m, index) => {
      const el = document.createElement("option")
      el.innerHTML = `${m.name}`
      el.value = `${index}`
      materialSelector?.appendChild(el)
    })

    materialSelector?.addEventListener("change", (e) => {
      Object.assign(window, {material: materialSelector.value})
    })

    if (!ctx) return;
    run(ctx, canvas.width, canvas.height);
  }
}

app();
