import movies from "@/public/database.json"
import cinemas from "@/public/cinema-info.json"
import Link from "next/link"

const Page = ({ params }: { params: { id: string } }) => {
  const shows = movies.reduce((acc, show) => {
    if (
      show.cinemaName === params.id &&
      !acc.find((s) => s.movieId === show.movieId)
    ) {
      acc.push(show)
    }
    return acc
  }, [] as typeof movies)
  const cinema = cinemas.find((c) => c.slug === params.id)

  if (!cinema) return null

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
      <h1 className="text-4xl font-bold mb-8">{cinema?.name}</h1>
      <h2 className="text-2xl font-semibold mb-4">
        Films récents ({shows.length})
      </h2>
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4">
        {shows.map((film) => {
          const isLiveShow = film.title?.startsWith("La Séance live")
          return (
            <Link
              href={`?movie=${film.movieId}`}
              key={film.showId}
              className="space-y-4"
            >
              <img
                src={film?.cover}
                alt={`Cover du film ${film.title}`}
                className="w-full object-cover rounded aspect-[2/3] border border-gray-200"
              />
              <div className="flex flex-col">
                <h2 className="font-semibold text-xl">
                  {isLiveShow ? film.title.split(":")[1] : film.title}
                </h2>
                <time
                  className="text-foreground/70 text-sm"
                  dateTime={new Date(film.dateShow).toISOString()}
                >
                  {new Date(film.dateShow).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </time>
              </div>
            </Link>
          )
        })}
      </section>
    </main>
  )
}

export default Page
