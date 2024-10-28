import movies from "@/public/database.json"
import type { useParams } from "next/navigation"

export const getMoviesByImdbId = () => {
  return movies.reduce((acc, show) => {
    const currentId = show.imdb?.id || show.movieId
    const isAlreadyInList = acc.has(currentId)

    if (isAlreadyInList) return acc

    acc.set(currentId, show)

    return acc
  }, new Map<string, (typeof movies)[number]>())
}

export const getMoviesByCinema = (params?: ReturnType<typeof useParams>) => {
  const isMultiplex = params?.id === "ugc" || params?.id === "pathe"
  const showsA = movies.reduce((acc, show) => {
    const currentId = show.imdb?.id || show.movieId
    const isAlreadyInList = acc.has(currentId)

    if (isAlreadyInList) return acc

    if (isMultiplex) {
      if (show.source !== params?.id) return acc

      acc.set(currentId, show)

      return acc
    }

    if (show.cinemaName === params?.id) {
      acc.set(currentId, show)
    }

    return acc
  }, new Map<string, (typeof movies)[number]>())

  return Array.from(showsA.values())
}
