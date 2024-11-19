"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import movies from "@/public/database.json"
import { useQueryState } from "nuqs"

const timeOptions = { hour: "2-digit", minute: "2-digit" } as const

export const Card = ({ movie }: { movie: (typeof movies)[number] }) => {
  const [_, toggle] = useQueryState("movie")

  const title = movie?.db?.title || movie.title
  const id = movie?.db?.id || movie.movieId
  const poster = movie?.db?.poster || movie.cover

  const time = new Date(movie.dateShow).toLocaleTimeString("fr-FR", timeOptions)
  const date = new Date(movie.dateShow).toLocaleDateString("fr-FR")

  return (
    <button
      onClick={() => toggle(id)}
      className="gap-4 flex flex-col justify-end rounded-xl relative aspect-[2/3] overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:to-black/65"
    >
      <img
        src={poster}
        alt={`Cover du film ${movie.title}`}
        className="size-full object-cover absolute inset-0"
      />
      <div className="relative z-10 inline-flex flex-col items-start p-4 w-full gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <h2 className="font-semibold text-xl text-left truncate w-full">
                {title}
              </h2>
            </TooltipTrigger>
            <TooltipContent>{title}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <p className="flex justify-between w-full">
          <span>{time}</span>
          <span>{date}</span>
        </p>
      </div>
    </button>
  )
}
