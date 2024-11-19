import movies from "@/public/database.json"

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params

  const shows = movies.filter(
    (film) => film.movieId === id || film.db?.id === id
  )

  return Response.json(shows)
}
