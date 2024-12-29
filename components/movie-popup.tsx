"use client"

import type { Movie } from "@/app/page"
import { MoviePopupInfo } from "@/components/movie-popup.info"
import { MoviePopupRating } from "@/components/movie-popup.rating"
import { MoviePopupShow } from "@/components/movie-popup.shows"
import { DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export const MoviePopup = ({ show }: { show: Movie }) => {
  const cover = show.db?.poster || show.cover || ""

  return (
    <DialogContent className="rounded-3xl p-12 flex gap-10 w-[64rem]">
      <div className="flex flex-col flex-shrink-0 gap-4">
        <div className="relative">
          <img
            src={cover}
            alt="Movie cover"
            className="object-cover w-64 aspect-[7/10] group-hover:scale-110 transition-transform duration-200 ease-out rounded-2xl"
          />
          <div
            className="opacity-75 bg-no-repeat bg-center bg-cover blur-2xl absolute saturate-200 inset-0 -z-10 transition-opacity duration-150 ease-out"
            style={{ backgroundImage: `url(${cover})` }}
          />
        </div>
        <MoviePopupRating />
      </div>
      <div className="space-y-6 flex-grow">
        <MoviePopupInfo />
        <MoviePopupShow />
      </div>
    </DialogContent>
  )
}
