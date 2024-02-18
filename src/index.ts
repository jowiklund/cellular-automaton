import { EntityDB, createQuery, createSpawner, createUpdater } from "./lib/ecs";
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

  const db: EntityDB = []

  const query = createQuery(db)
  const spawn = createSpawner(db)
  const update = createUpdater(db, query)

  spawn([{type: "id", value: 1},{type: "position", x: 10, y: 10}, {type: "temperature", temp: 1}])
  spawn([{type: "position", x: 1, y: 1}, {type: "temperature", temp: 1}])

  update([{type: "id", value: 1}], (data) => {
    return data.map(e => e.type ==="position" ? ({
    ...e,
    y: e.y+1
    }) : (e)) 
  })
}

app();
