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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SOURCE_PROVIDER } from "@/constants/mapping"

type Show = (typeof shows)[number]

cinemaInfo.find((cinema) => cinema.slug === shows[0]?.cinemaName)

const Line = ({ show }: { show: Show }) => {
  const cinema = cinemaInfo.find((c) => c.slug === show?.cinemaName)

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
          {cinema.googleMaps && (
            <Link
              href={cinema.googleMaps}
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

  const sources =
    shows?.reduce((acc, show) => {
      if (!acc.includes(show.source)) {
        acc.push(show.source)
      }

      return acc
    }, [] as string[]) || []

  useEffect(() => {
    if (!movieId) return

    fetch(`/api/movie/${movieId}`)
      .then((res) => res.json())
      .then((data: Show[]) => setShows(data))
  }, [movieId])

  const isOpen = !!movieId

  if (!shows) return null

  const showsCinema = sources.map((source) => {
    const showsByCinema = shows.filter((show) => show.source === source)

    return showsByCinema.reduce((acc, show) => {
      const cinema = acc.find((c) => c.cinemaName === show.cinemaName)

      if (cinema) {
        cinema.shows.push(show)
      } else {
        acc.push({
          cinemaName: show.cinemaName,
          shows: [show],
        })
      }

      return acc
    }, [] as { cinemaName: string; shows: Show[] }[])
  })

  const release = shows[0]?.officialRelease
    ? new Date(shows[0]?.officialRelease)
    : null

  console.log(showsCinema)
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && toggle(null)}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-1 text-xl">
            Séances de {shows[0].title}
          </SheetTitle>
          <SheetDescription asChild>
            <div>
              <p className="text-sm">
                Sortie initiale le{" "}
                {release?.toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
              </p>

              <Tabs defaultValue={sources[0]} className="mt-8 w-full">
                <TabsList className="w-full">
                  {sources.map((source) => (
                    <TabsTrigger className="w-1/2" key={source} value={source}>
                      {SOURCE_PROVIDER[source as keyof typeof SOURCE_PROVIDER]}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {sources.map((source) => (
                  <TabsContent key={source} value={source}>
                    <Accordion type="single" collapsible className="w-full">
                      {showsCinema[sources.findIndex((s) => s === source)].map(
                        ({ cinemaName, shows }) => {
                          const cinema = cinemaInfo.find(
                            (c) => c.slug === cinemaName
                          )

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
                        }
                      )}
                    </Accordion>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
