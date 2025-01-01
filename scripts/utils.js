import { readFileSync } from "fs"

export const uniqueArray = (a) =>
  a.filter(
    (value, index, self) => index === self.findIndex((t) => t.id === value.id)
  )

export const loadJson = (path) => {
  return JSON.parse(readFileSync(path, "utf-8") || "[]")
}
