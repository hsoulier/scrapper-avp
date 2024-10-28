import { Card } from "@/components/card"
import { getMoviesByImdbId } from "@/lib/movies"

export default function Page() {
  const shows = Array.from(getMoviesByImdbId().values())

  return (
    <main className="p-4 relative flex min-h-svh flex-1 flex-col bg-background">
      <h1 className="text-4xl font-bold mb-8">
        Films récents ({shows.length})
      </h1>
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4">
        {shows.map((movie) => (
          <Card key={movie.movieId} movie={movie} />
        ))}
      </section>
    </main>
  )
}
