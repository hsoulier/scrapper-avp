import { readFileSync } from "fs"
import "dotenv/config"
import postgres from "postgres"
import { createClient } from "@supabase/supabase-js"

export const uniqueArray = (a) =>
  a.filter(
    (value, index, self) => index === self.findIndex((t) => t.id === value.id)
  )

export const loadJson = (path) => {
  return JSON.parse(readFileSync(path, "utf-8") || "[]")
}

const connectionString = process.env.DATABASE_URL

export const supabase = createClient(
  "https://yafeugsphejhrcwqmesx.supabase.co",
  process.env.SUPABASE_KEY
)

export const sql = postgres(connectionString)
