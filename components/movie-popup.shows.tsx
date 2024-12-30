"use client"

import { UGCIcon } from "@/components/icons/ugc"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import movies from "@/public/database.json"
import { useSearchParams } from "next/navigation"
import { PatheIcon } from "@/components/icons/pathe"
import Link from "next/link"

export const providers = {
  ugc: <UGCIcon className="w-6" />,
  pathe: <PatheIcon className="w-6" />,
} as const

export type Provider = keyof typeof providers

export const MoviePopupShow = () => {
  const searchParams = useSearchParams()
  const showId = searchParams.get("id")

  if (!showId) return null

  const shows = movies.filter(
    (movie) => (movie.db?.id || movie.movieId) === showId
  )

  return (
    <div className="space-y-4">
      {shows.map((show) => {
        const releaseDate = new Date(show.dateShow)
        const releaseDateString = releaseDate.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
        const releaseTimeString = releaseDate.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })

        return (
          <div
            key={show.showId}
            className="bg-gray-background/50 flex-nowrap justify-between items-center border border-gray-200 p-4 rounded-2xl flex"
          >
            <div className="flex flex-nowrap gap-2">
              {providers[show.source as Provider]} {show.cinemaName}
            </div>
            <div className="ml-4">{releaseDateString}</div>
            <div className="ml-4">{releaseTimeString}</div>
            <Link
              href={show.linkShow}
              className="ml-4 size-8 p-1 rounded-md bg-gray-900 text-gray-background dark:bg-gray-white"
            >
              <ArrowRightIcon className="size-6" />
            </Link>
          </div>
        )
      })}
    </div>
  )
}
