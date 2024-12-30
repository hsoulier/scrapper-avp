"use client"

import { useSearchParams } from "next/navigation"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserGroupIcon } from "@heroicons/react/24/outline"
import movies from "@/public/database.json"

const mappingAVP = {
  AVPE: "AVP avec équipe du film",
  AVP: "Avant-première",
} as const

export const MoviePopupInfo = () => {
  const searchParams = useSearchParams()
  const showId = searchParams.get("id")

  if (!showId) return null

  const show = movies.find(
    (movie) => (movie.db?.id || movie.movieId) === showId
  )

  return (
    <DialogHeader className="space-y-4">
      <DialogTitle className="text-2xl font-semibold flex gap-1">
        <span className="truncate">{show?.title}</span>
        <span className="flex-shrink-0 font-normal ml-4 bg-gray-100 inline-flex gap-2 p-2 rounded-xl text-xs">
          <UserGroupIcon className="size-4 text-gray-500" />
          {mappingAVP[show?.earlyType as keyof typeof mappingAVP]}
        </span>
      </DialogTitle>
      <div className="space-y-3">
        <div className="gap-1 flex flex-col">
          <span className="font-light text-gray-500">Réalisé par</span>
          <span className="font-light">Karim Aïnouz</span>
        </div>
        <div className="gap-1 flex flex-col">
          <span className="font-light text-gray-500">Sortie prévue le</span>
          <span className="font-light">Karim Aïnouz</span>
        </div>
        <div className="gap-1 flex flex-col">
          <span className="font-light text-gray-500">Durée</span>
          <span className="font-light">1h55</span>
        </div>
        <div className="gap-1 flex flex-col">
          <span className="font-light text-gray-500">Synopsis</span>
          <p className="font-light">
            Ceará, côte nord-est du Brésil. 30 degrés toute l’année. Chaque
            nuit, au Motel Destino, se jouent à l’ombre des regards de dangereux
            jeux de désir, de pouvoir et de violence. Un soir, l’arrivée du
            jeune Heraldo vient troubler les règles du motel.
          </p>
        </div>
      </div>
    </DialogHeader>
  )
}
