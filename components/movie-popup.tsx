"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { parseAsString, useQueryState } from "nuqs"
import React, { useEffect, useState } from "react"
import shows from "@/public/database.json"
import cinemaInfo from "@/public/cinema-info.json"
import { Map as MapIcon, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { openInNewTab } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

type Show = (typeof shows)[number]

cinemaInfo.find((cinema) => cinema.slug === shows[0]?.cinemaName)

const Line = ({ show }: { show: Show }) => {
  const cinema = cinemaInfo.find((c) => c.slug === show?.cinemaName)

  console.log({ cinema })

  if (!cinema) return null

  return (
    <div key={show.showId} className="flex justify-between items-center">
      <div className="space-y-0.5">
        <span className="inline-flex items-center">
          {new Date(show.dateShow).toLocaleDateString("fr-FR", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}{" "}
          à {cinema.name}{" "}
          {cinema.googleMyBusinessUrl && (
            <Link
              href={cinema.googleMyBusinessUrl}
              className="hover:bg-neutral-100 p-2 rounded-full transition-opacity duration-100"
              target="_blank"
            >
              <MapIcon className="opacity-60 size-5" />
            </Link>
          )}
        </span>
        <div className="flex flex-wrap gap-1">
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-red-700 border-red-700 bg-red-300">
            {show.version}
          </span>
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-blue-700 border-blue-700 bg-blue-300">
            {show.source}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => openInNewTab(show.linkMovie)}
        >
          <LinkIcon />
          Film
        </Button>
        <Button size="sm" onClick={() => openInNewTab(show.linkShow)}>
          <LinkIcon />
          Réserver
        </Button>
      </div>
    </div>
  )
}

export const MoviePopup = () => {
  const [movieId, toggle] = useQueryState("movie", parseAsString)
  const [shows, setShows] = useState<Show[]>()
  const [showsCinema, setShowsCinema] = useState<Record<string, Show[]>>()

  useEffect(() => {
    if (!movieId) return

    fetch(`/api/movie/${movieId}`)
      .then((res) => res.json())
      .then((data: Show[]) => {
        setShows(data)

        const showsByCinema = data.reduce((acc, movie) => {
          if (!acc.has(movie.cinemaName)) {
            acc.set(movie.cinemaName, [movie])
          } else {
            acc.set(movie.cinemaName, [...acc.get(movie.cinemaName)!, movie])
          }

          return acc
        }, new Map<string, Show[]>())

        setShowsCinema(Object.fromEntries(showsByCinema))
      })
  }, [movieId])

  const isOpen = !!movieId

  if (!shows || !showsCinema) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && toggle(null)}>
      <DialogContent className="max-h-[50vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1 text-xl">
            Seances de {shows[0].title}
          </DialogTitle>
          <DialogDescription asChild>
            <div>
              <p className="text-sm">Sortie initiale le {"DATE"}</p>
              <div className="flex flex-col gap-1">
                <Accordion type="single" collapsible className="w-full">
                  {Object.entries(showsCinema).map(([cinemaName, shows]) => {
                    const cinema = cinemaInfo.find((c) => c.slug === cinemaName)

                    return (
                      <AccordionItem key={cinemaName} value={cinemaName}>
                        <AccordionTrigger>
                          {cinema?.name || "Cinema"}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            {shows.map((show) => (
                              <Line key={show.showId} show={show} />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
                {/* {shows.map((show) => (
                <Line key={show.showId} show={show} />
              ))} */}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
