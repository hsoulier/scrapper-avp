import { createDb, type Shark } from "@/lib/database"
import type { NextRequest } from "next/server"

const db = await createDb()

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  const res = await db.get<Shark>(`SELECT sharks WHERE id = ?`, id)

  return Response.json(res)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { name } = await req.json()
  const { id } = params
  const res = await db.run(`UPDATE sharks SET name = ? WHERE id = ?`, name, id)

  return Response.json({ id, res })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const res = await db.run(`DELETE FROM sharks WHERE id = ?`, id)

  return Response.json(res)
}
