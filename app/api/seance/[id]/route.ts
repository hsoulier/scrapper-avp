import movies from "@/public/database.json"

export const GET = async (request: Request, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const { id } = params

  const movie = movies.find((film) => film.showId === id)

  return Response.json(movie)
}
