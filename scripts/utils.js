import { readFileSync } from "fs"
import "dotenv/config"
import postgres from "postgres"

export const uniqueArray = (a) =>
  a.filter(
    (value, index, self) => index === self.findIndex((t) => t.id === value.id)
  )

export const loadJson = (path) => {
  return JSON.parse(readFileSync(path, "utf-8") || "[]")
}

const connectionString = process.env.DATABASE_URL

export const sql = postgres(connectionString)
