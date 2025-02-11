"use client"

import { useSearchParams } from "next/navigation"
import { providers, type Provider } from "@/components/movie-popup.show"
import type { ShowAggregated } from "@/lib/queries"
import { Tooltip } from "@/components/ui/tooltip"
import { Fragment } from "react"

export const MovieCard = ({ movie }: { movie: ShowAggregated }) => {
  const searchParams = useSearchParams()

  const cover = movie.poster || ""
  const id = movie.movie_id

  const date = new Date(movie.release || "")

  const mProviders = [
    ...new Set(movie?.shows.map((show) => show?.cinemaId.split("-")[0])),
  ]

  const toggleOpen = () => {
    // const params = new SuperParams(searchParams.toString())
    // params.set("id", id)
    // window.history.pushState(null, "", `?${params.toString()}`)
  }

  return (
    <article
      className="group relative after:z-10 after:inset-0 after:absolute after:content-[''] after:bg-gradient-to-b after:from-0% after:from-transparent after:via-black/70 after:via-40% after:to-black after:to-100% after:rounded-[inherit] rounded-xl w-full aspect-[27/40] cursor-pointer"
      onClick={toggleOpen}
    >
      <div className="size-full bg-center bg-cover rounded-[inherit] overflow-hidden">
        <img
          src={cover}
          alt="Movie cover"
          className="object-cover size-full group-hover:scale-110 transition-transform duration-200 ease-out"
        />
      </div>
      <div
        className="opacity-0 group-hover:opacity-20 bg-no-repeat bg-center bg-cover blur-xl absolute saturate-100 -inset-0 -z-10 transition-opacity duration-150 ease-out"
        style={{ backgroundImage: `url(${cover})` }}
      />

      <div className="flex absolute inset-x-4 top-4 items-stretch justify-end gap-2">
        {mProviders.map((provider, index) => (
          <div
            key={index}
            className="size-8 text-gray-white flex min-w-0 items-center rounded-lg bg-gray-background/50 backdrop-blur-sm px-2"
          >
            {providers[provider as Provider]}
          </div>
        ))}
      </div>

      <header className="absolute bottom-4 inset-x-4 space-y-1 z-20 text-gray-background dark:text-gray-white">
        <h3 className="text-lg font-semibold">{movie.title}</h3>
        <p className="text-sm font-light flex justify-between">
          <span>
            {date.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span>{date.toLocaleDateString("fr-FR")}</span>
        </p>
      </header>
    </article>
  )
}
