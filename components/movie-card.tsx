"use client"

import { useSearchParams } from "next/navigation"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { SuperParams } from "@/lib/utils"
import { providers, type Provider } from "@/components/movie-popup.shows"
import { useState } from "react"
import type { ShowAggregated } from "@/lib/queries"
import { MoviePopup } from "@/components/movie-popup"

export const MovieCard = ({ show }: { show: ShowAggregated }) => {
  const searchParams = useSearchParams()
  const [open, setOpen] = useState<boolean>(false)

  const cover = show.moviePoster || ""
  const id = show.id

  const date = new Date(show.date || "")

  const toggleOpen = (o: boolean) => {
    const params = new SuperParams(searchParams.toString())

    if (!o) params.delete("id")
    else params.set("id", id)

    setOpen(o)

    window.history.pushState(null, "", `?${params.toString()}`)
  }

  return (
    <Dialog onOpenChange={toggleOpen} open={open}>
      <DialogTrigger>
        <div className="size-full bg-center bg-cover rounded-[inherit] overflow-hidden">
          <img
            src={cover}
            alt="Movie cover"
            className="object-cover size-full group-hover:scale-110 transition-transform duration-200 ease-out"
          />
        </div>
        <div
          className="opacity-0 group-hover:opacity-20 bg-no-repeat bg-center bg-cover blur-xl absolute saturate-200 -inset-0 -z-10 transition-opacity duration-150 ease-out"
          style={{ backgroundImage: `url(${cover})` }}
        />
        <span className="absolute top-4 right-4 bg-gray-background size-8 rounded-lg inline-grid place-content-center">
          {providers[show.cinemaSource as Provider]}
        </span>
        <header className="absolute bottom-4 inset-x-4 space-y-1 z-20 text-gray-background dark:text-gray-white">
          <h3 className="text-lg font-semibold">{show.movieTitle}</h3>
          <p className="text-sm font-light flex justify-between">
            <span>
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span>{date.toLocaleDateString("fr-FR")}</span>
          </p>
        </header>
      </DialogTrigger>
      <MoviePopup show={show} />
    </Dialog>
  )
}
