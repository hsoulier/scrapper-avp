import { open } from "sqlite"
import sqlite3 from "sqlite3"

const filename = "./database.db"

const createDb = async () => {
  const db = await open({
    filename,
    driver: sqlite3.Database,
  })

  return db
}

export type Shark = {
  ID: number
  name: string
  color: string
  weight: number
}

const createTable = async () => {
  const db = await createDb()
  await db.exec(`
  CREATE TABLE sharks
  (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    name   VARCHAR(50) NOT NULL,
    color   VARCHAR(50) NOT NULL,
    weight INTEGER NOT NULL
  );
`)
}

export { createDb }
