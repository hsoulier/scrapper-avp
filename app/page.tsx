import Link from "next/link"
import movies from "@/public/database.json"
import { Card } from "@/components/card"

export default function Page() {
  const shows = movies.reduce((acc, movie) => {
    if (!acc.has(movie.movieId)) {
      acc.set(movie.movieId, movie)
    }
    return acc
  }, new Map<string, (typeof movies)[number]>())

  const showsArray = Array.from(shows.values())

  return (
    <main className="p-4 relative flex min-h-svh flex-1 flex-col bg-background">
      <h1 className="text-4xl font-bold mb-8">
        Films récents ({showsArray.length})
      </h1>
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4">
        {showsArray.map((movie) => (
          <Card key={movie.movieId} movie={movie} />
        ))}
      </section>
    </main>
  )
}
