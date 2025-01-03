"use client"

import { useSearchParams } from "next/navigation"
import { SuperParams } from "@/lib/utils"
import { providers, type Provider } from "@/components/movie-popup.shows"
import type { ShowAggregated } from "@/lib/queries"

export const MovieCard = ({ show }: { show: ShowAggregated }) => {
  const searchParams = useSearchParams()

  const cover = show.movies.poster || ""
  const id = show.id

  const date = new Date(show.date || "")

  const toggleOpen = () => {
    const params = new SuperParams(searchParams.toString())

    params.set("id", id)

    window.history.pushState(null, "", `?${params.toString()}`)
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
      <span className="absolute top-4 right-4 bg-gray-background size-8 rounded-lg inline-grid place-content-center">
        {providers[show.cinemas.source as Provider]}
      </span>
      <header className="absolute bottom-4 inset-x-4 space-y-1 z-20 text-gray-background dark:text-gray-white">
        <h3 className="text-lg font-semibold">{show.movies.title}</h3>
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
