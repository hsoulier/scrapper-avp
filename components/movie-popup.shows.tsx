"use client"

import { UGCIcon } from "@/components/icons/ugc"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { useSearchParams } from "next/navigation"
import { PatheIcon } from "@/components/icons/pathe"
import Link from "next/link"
import type { ShowAggregated } from "@/lib/queries"

export const providers = {
  ugc: <UGCIcon className="w-6" />,
  pathe: <PatheIcon className="w-6" />,
} as const

export type Provider = keyof typeof providers

export const MoviePopupShow = ({ show }: { show: ShowAggregated }) => {
  const searchParams = useSearchParams()
  const showId = searchParams.get("id")

  if (!showId) return null

  const releaseDate = new Date(show.date || "")
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
    <div className="space-y-4">
      <div
        key={show.id}
        className="bg-gray-background/50 flex-nowrap justify-between items-center border border-gray-200 p-4 rounded-2xl flex"
      >
        <div className="flex flex-nowrap gap-2">
          {providers[show.cinemaSource as Provider]} {show.cinemaName}
          <span>
            ({show?.cinemaArrondissement || ""}
            <sup>e</sup>)
          </span>
        </div>
        <div className="ml-4">{releaseDateString}</div>
        <div className="ml-4">{releaseTimeString}</div>
        <Link
          href={show.linkShow || ""}
          className="ml-4 size-8 p-1 rounded-md bg-gray-900 text-gray-background dark:bg-gray-white"
        >
          <ArrowRightIcon className="size-6" />
        </Link>
      </div>
    </div>
  )
}
