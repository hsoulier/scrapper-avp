import movies from "@/public/database.json"

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params

  const movie = movies.find((film) => film.showId === id)

  return Response.json(movie)
}
