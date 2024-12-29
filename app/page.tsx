import { MovieCard } from "@/components/movie-card"
import movies from "@/public/database.json"

export const metadata = {
  title: "Avant première Paris",
  description: "Découvrez les avant-premières de films à Paris",
}

export type Movie = (typeof movies)[number]

const showsMap = movies.reduce((acc, movie) => {
  const id = movie.db?.id || movie.movieId

  if (acc.has(id)) {
    acc.set(id, [...(acc.get(movie.db.id || "") || []), movie])

    return acc
  }
  acc.set(id, [movie])

  return acc
}, new Map<string, Movie[]>())

const shows = [...showsMap.values()].flat()

const Page = () => {
  return (
    <>
      {shows.map((show) => (
        <MovieCard key={show.showId} show={show} />
      ))}
    </>
  )
}

export default Page
