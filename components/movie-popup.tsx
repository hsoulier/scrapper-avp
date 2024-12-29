"use client"

import { MoviePopupInfo } from "@/components/movie-popup.info"
import { MoviePopupRating } from "@/components/movie-popup.rating"
import { MoviePopupShow } from "@/components/movie-popup.shows"
import { DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export const MoviePopup = () => {
  return (
    <DialogContent className="rounded-3xl p-12 flex gap-10 w-[64rem]">
      <div className="flex flex-col flex-shrink-0 gap-4">
        <div
          className={cn(
            "relative",
            `after:content-[''] after:-z-10 after:inset-0 after:absolute after:bg-no-repeat after:bg-center after:bg-cover after:opacity-75 after:blur-2xl after:saturate-200 after:bg-[url(https://m.media-amazon.com/images/M/MV5BMjQwM2Q5Y2ItNjJjNy00OGI2LWIxMmItY2ZkZmE4NjZiZGMyXkEyXkFqcGc@._V1_.jpg)]`
          )}
        >
          <img
            src="https://m.media-amazon.com/images/M/MV5BMjQwM2Q5Y2ItNjJjNy00OGI2LWIxMmItY2ZkZmE4NjZiZGMyXkEyXkFqcGc@._V1_.jpg"
            alt="Movie cover"
            className="object-cover w-64 aspect-[7/10] group-hover:scale-110 transition-transform duration-200 ease-out rounded-2xl"
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
