import movies from "@/public/database.json"
import cinemas from "@/public/cinema-info.json"
import Link from "next/link"
import { Card } from "@/components/card"

const Page = ({ params }: { params: { id: string } }) => {
  const isMultiplex = params.id === "ugc" || params.id === "pathe"
  const showsA = movies.reduce((acc, show) => {
    const currentId = show.imdb?.id || show.movieId
    const isAlreadyInList = acc.has(currentId)

    if (isAlreadyInList) return acc

    if (isMultiplex) {
      if (show.source !== params.id) return acc

      acc.set(currentId, show)

      return acc
    }

    if (show.cinemaName === params.id) {
      acc.set(currentId, show)
    }

    return acc
  }, new Map<string, (typeof movies)[number]>())

  const shows = Array.from(showsA.values())

  const cinema = cinemas.find((c) => c.slug === params.id)

  if (!cinema && !isMultiplex) return null

  if (!shows.length) {
    return (
      <main className="p-4 relative flex h-svh flex-1 flex-col bg-background">
        <h1 className="text-4xl font-bold mb-8">{cinema?.name}</h1>
        <p className="text-lg text-foreground/70 grow grid place-content-center">
          Aucun film n'est actuellement programmé dans ce cinéma.
        </p>
      </main>
    )
  }

  return (
    <main className="p-4 relative flex min-h-svh flex-1 flex-col bg-background">
      <h1 className="text-4xl font-bold mb-8 capitalize">
        {!isMultiplex && cinema?.name}
        {isMultiplex && `Tous les ${params.id}`}
      </h1>
      <h2 className="text-2xl font-semibold mb-4">
        Films récents ({shows.length})
      </h2>
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4">
        {shows.map((movie) => (
          <Card key={movie.movieId} movie={movie} />
        ))}
      </section>
    </main>
  )
}

export default Page
