import { createDb, type Shark } from "@/lib/database"

const db = await createDb()

export async function GET() {
  const res = await db.all<Shark[]>(`SELECT * FROM sharks`)

  return Response.json(res)
}

export async function POST(request: Request) {
  const { name, color, weight } = await request.json()

  const res = await db.run(
    `INSERT INTO sharks (name, color, weight) VALUES (?, ?, ?)`,
    [name, color, weight]
  )

  res.lastID
  return Response.json({ id: res.lastID })
}
