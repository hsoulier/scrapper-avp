"use client"

import { useSearchParams } from "next/navigation"
import type { Movie } from "@/app/page"
import { UGCIcon } from "@/components/icons/ugc"
import { MoviePopup } from "@/components/movie-popup"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { SuperParams } from "@/lib/utils"

export const MovieCard = ({ show }: { show: Movie }) => {
  const cover = show.db?.poster || show.cover || ""
  const id = show.db?.id || show.movieId

  const searchParams = useSearchParams()

  const isOpen = searchParams.get("id") === id

  const toggleOpen = (o: boolean) => {
    const params = new SuperParams(searchParams.toString())

    if (!o) params.delete("id")
    else params.set("id", id)

    window.history.pushState(null, "", `?${params.toString()}`)
  }

  return (
    <Dialog onOpenChange={toggleOpen} open={isOpen}>
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
        <span className="absolute top-4 right-4 bg-gray-background p-0.5 rounded-lg">
          <UGCIcon />
        </span>
        <header className="absolute bottom-4 inset-x-4 space-y-1 z-20 text-gray-background dark:text-gray-white">
          <h3 className="text-lg font-semibold">{show.title}</h3>
          <p className="text-sm font-light flex justify-between">
            <span>20h30</span>
            <span>11/11/2024</span>
          </p>
        </header>
      </DialogTrigger>
      <MoviePopup show={show} />
    </Dialog>
  )
}
