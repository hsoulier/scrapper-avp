"use client"

import { useSearchParams } from "next/navigation"
import { SuperParams } from "@/lib/utils"
import { providers, type Provider } from "@/components/movie-popup.show"
import type { ShowAggregated } from "@/lib/queries"
import { Tooltip } from "@/components/ui/tooltip"

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

      <div className="flex absolute inset-x-4 top-4 items-stretch justify-end gap-2">
        <div className="text-gray-white flex min-w-0 items-center gap-1 rounded-lg bg-gray-background px-2">
          {providers[show.cinemas.source as Provider]}
          <div className="truncate text-gray-white font-light">
            {show.cinemas.name}
          </div>
        </div>
        <Tooltip className="grid size-8 shrink-0 place-content-center rounded-lg bg-gray-background text-gray-white" content="Provider">
          {providers[show.cinemas.source as Provider]}
        </Tooltip>
      </div>

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
