import Link from "next/link"
import movies from "@/public/database.json"

export default function MusicPage() {
  const shows = movies.reduce((acc, movie) => {
    if (!acc.has(movie.movieId)) {
      acc.set(movie.movieId, movie)
    }
    return acc
  }, new Map<string, (typeof movies)[number]>())

  const showsArray = Array.from(shows.values())

  console.log(showsArray.map((film) => film.name))

  return (
    <>
      <section>
        <h1 className="text-4xl font-bold mb-8">Films récents</h1>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,1fr))] gap-y-6 gap-x-4">
          {showsArray.map((film) => (
            <Link
              href={`?movie=${film.movieId}`}
              key={film.showId}
              className="space-y-4"
            >
              <img
                src={film?.cover}
                alt={`Cover du film ${film.name}`}
                className="w-full h-64 object-cover rounded"
              />
              <div className="flex flex-col">
                <h2 className="font-semibold text-xl">{film.name}</h2>
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
          ))}
        </div>
      </section>
    </>
  )
}
