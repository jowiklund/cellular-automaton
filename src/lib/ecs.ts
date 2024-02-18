type RGBA = [number,number,number,number]

export type MaterialIdComponent = {type: "material", id: number}
export type PositionComponent = {type: "position", x: number, y: number}
export type TemperatureComponent = {type: "temperature", temp: number}
export type VelocityComponent = {type: "velocity", x: number, y: number}
export type SpriteComponent = {type: "sprite", data: ImageBitmap}
export type PixelsComponent = {type: "pixels", data: RGBA[][]}
export type IdComponent = Readonly<{type: "id", value: number}>

type Component
= PositionComponent
| TemperatureComponent
| MaterialIdComponent
| VelocityComponent
| SpriteComponent
| PixelsComponent
| IdComponent

export type MaterialEntity = [MaterialIdComponent, PositionComponent, PixelsComponent]

export type Entity = Component[]

export type EntityDB = Entity[]

export const createSpawner = (db: EntityDB) => (entity: Entity) => {
  db.push(entity)
}

export const createUpdater = (db: EntityDB, query: (entity: Entity) => Entity[]) => (entity: Entity, transformer: (entity: Entity) => Entity) => {
  const queryResult = query(entity)
  for (let i = 0; i < queryResult.length; i++) {
    const dbIndex = db.indexOf(queryResult[i])
    db[dbIndex] = transformer(queryResult[i])
  }
}

export const createQuery = (db: EntityDB) => (query: Entity): Entity[] => {
  const queryString = query.map(i => JSON.stringify(i)).join("")
  const queryTypes = query.map(i => i.type)
  const includesQueryType = db.filter(e => e.some(c => {
    return queryTypes.includes(c.type)
  }))

  const signature = (e: Entity) => e.filter(e => queryTypes.includes(e.type)).map(i => JSON.stringify(i)).join("")
  return includesQueryType.filter(e => {
    return signature(e) === queryString;
  })
}

export const createPointer = (db: EntityDB) => (x: number, y: number) => {
  const withPosition = db.filter(e => e.some(c => c.type === "position"))
  return withPosition.reduce((acc,curr) => {
    const pos = curr.find(i => i.type === "position")
    if (!pos || pos.type !== "position") return acc;

    const currDx = x - pos.x
    const currDy = y - pos.y
    const currDsq = currDx * currDx + currDy * currDy;

    const accPos = acc.find(i => i.type === "position")
    if (!accPos || accPos.type !== "position") return curr;

    const accDx = x - accPos.x
    const accDy = y - accPos.y
    const accDsq = accDx * accDx + accDy * accDy;

    return currDsq < accDsq ? curr : acc
  }, [])
}
