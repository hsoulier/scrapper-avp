"use client"

import { useSearchParams } from "next/navigation"
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserGroupIcon } from "@heroicons/react/24/outline"
import type { ShowAggregated } from "@/lib/queries"
import { formatTime } from "@/lib/utils"

const mappingAVP = {
  AVPE: "AVP avec équipe du film",
  AVP: "Avant-première",
} as const

export const MoviePopupInfo = ({ show }: { show: ShowAggregated }) => {
  const searchParams = useSearchParams()
  const showId = searchParams.get("id")

  if (!showId) return null

  return (
    <DialogHeader className="space-y-4">
      <DialogTitle className="text-2xl font-semibold flex gap-1">
        <span className="truncate">{show?.movies.title}</span>
        <span className="flex-shrink-0 font-normal ml-4 bg-gray-100 inline-flex gap-2 p-2 rounded-xl text-xs">
          <UserGroupIcon className="size-4 text-gray-500" />
          {mappingAVP[show?.avpType as keyof typeof mappingAVP]}
        </span>
      </DialogTitle>
      <div className="space-y-3">
        <div className="gap-1 flex flex-col">
          <span className="font-light text-gray-500">Réalisé par</span>
          <span className="font-light">{show?.movies.director}</span>
        </div>
        <div className="gap-1 flex flex-col">
          <span className="font-light text-gray-500">Sortie prévue le</span>
          <span className="font-light">
            {new Date(show?.movies.release || "").toLocaleDateString("fr-FR")}
          </span>
        </div>
        <div className="gap-1 flex flex-col">
          <span className="font-light text-gray-500">Durée</span>
          <span className="font-light">
            {formatTime(show.movies.duration || 0)}
          </span>
        </div>
        <div className="gap-1 flex flex-col">
          <span className="font-light text-gray-500">Synopsis</span>
          <DialogDescription asChild>
            <p className="font-light">{show.movies.synopsis}</p>
          </DialogDescription>
        </div>
      </div>
    </DialogHeader>
  )
}
