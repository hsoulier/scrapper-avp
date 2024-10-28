"use client"

import movies from "@/public/database.json"
import { useQueryState } from "nuqs"

export const Card = ({ movie }: { movie: (typeof movies)[number] }) => {
  const [_, toggle] = useQueryState("movie")

  const title = movie?.imdb?.title || movie.title

  const id = movie?.imdb?.id || movie?.allocine?.id || movie.movieId

  return (
    <button
      onClick={() => toggle(id)}
      className="gap-4 flex flex-col justify-start"
    >
      <img
        src={movie?.imdb?.poster || movie?.cover}
        alt={`Cover du film ${movie.title}`}
        className="w-full object-cover rounded aspect-[2/3] border border-foreground/30"
      />
      <div className="inline-flex flex-col items-start">
        <h2 className="font-semibold text-xl text-left">{title}</h2>
        <time
          className="text-foreground/70 text-sm"
          dateTime={new Date(movie.dateShow).toISOString()}
        >
          {new Date(movie.dateShow).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </time>
      </div>
    </button>
  )
}
