import { materials } from "./lib/materials";
import { run } from "./lib/rendering"

function app() {
  window.onload = function() {
    const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (!ctx) return;
    run(ctx, canvas.width, canvas.height);
  }
}

app();
