"use client"

import { MoviePopupRating } from "@/components/movie-popup.rating"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { getShowAggregated } from "@/lib/queries"
import { numToTime } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { Calendar, ChevronLeft, Clock, UsersRound } from "lucide-react"
import { useParams } from "next/navigation"

export const Content = () => {
  const { id } = useParams<{ id: string }>()

  const supabase = useSupabaseBrowser()

  const { data } = useQuery({
    queryKey: [`show-${id}`],
    queryFn: async () => {
      const response = await getShowAggregated(supabase, id)

      return response.data
    },
  })

  const cover =
    "https://image.tmdb.org/t/p/w1280/7siQLbBArdLKZ8Zz6Uz8C1hb7sI.jpg"

  const show = {
    movies: {
      title: "Motel Destino",
      director: "Karim Ainouz",
      release: "2022-02-02",
      duration: 90,
      synopsis:
        "Ceará, côte nord-est du Brésil. 30 degrés toute l’année. Chaque nuit, au Motel Destino, se jouent à l’ombre des regards de dangereux jeux de désir, de pouvoir et de violence. Un soir, l’arrivée du jeune Heraldo vient troubler les règles du motel.",
    },
  }

  return (
    <main className="mx-5">
      <button
        className="inline-flex items-center gap-1 p-2 text-sm font-light"
        onClick={() => history.back()}
      >
        <ChevronLeft />
        Retour
      </button>
      <div className="flex flex-col gap-8">
        <div className="mt-6 grid grid-cols-5 gap-4">
          <div className="relative col-span-2">
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

          <div className="space-y-4 col-span-3">
            <h1 className="text-2xl font-semibold flex flex-wrap gap-1 lg:flex-nowrap">
              <span className="truncate">{show?.movies.title}</span>
              {/* <span className="flex-shrink-0 font-normal lg:ml-4 bg-gray-100 inline-flex gap-2 p-2 rounded-xl text-xs">
              <UserGroupIcon className="size-4 text-gray-500" />
              {mappingAVP[show?.avpType as keyof typeof mappingAVP]}
            </span> */}
            </h1>

            <div className="space-y-3">
              <div className="gap-1 flex flex-col">
                <span className="font-light text-gray-500">Réalisé par</span>
                <span className="font-light">{show?.movies.director}</span>
              </div>

              <div className="gap-1 flex flex-col">
                <span className="font-light text-gray-500">
                  Sortie prévue le
                </span>

                <span className="font-light">
                  {new Date(show?.movies.release || "").toLocaleDateString(
                    "fr-FR"
                  )}
                </span>
              </div>

              <div className="gap-1 flex flex-col">
                <span className="font-light text-gray-500">Durée</span>
                <span className="font-light">
                  {numToTime(show.movies.duration || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <MoviePopupRating />
        <div className="gap-1 flex flex-col">
          <span className="font-light text-gray-500">Synopsis</span>
          <p className="font-light">{show.movies.synopsis}</p>
        </div>
      </div>
      <section className="flex flex-col gap-12 my-12">
        <div className="flex gap-3">
          <button>Toutes les séances</button>
          <button>Avec l'équipe du film</button>
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ugc" className="border-none py-0">
            <AccordionTrigger className="hover:no-underline py-0">
              <div className="flex items-center justify-start w-full gap-1 hover:no-underline">
                <span className="text-2xl font-semibold">UGC</span>
                <span className="text-2xl font-light">(3)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-6 pt-6">
                <div className="p-4 border border-gray-100 rounded-xl">
                  <p className="font-medium mb-3">
                    <UsersRound className="text-[#FDD700] inline size-4 mr-2" />{" "}
                    UGC Ciné Cité Les Halles
                  </p>
                  <div className="flex justify-start gap-4 font-light">
                    <span>
                      <Calendar className="inline size-4 text-gray-500 mr-1" />
                      01/01/2025
                    </span>
                    <span>
                      <Clock className="inline size-4 text-gray-500 mr-1" />
                      20h30
                    </span>
                  </div>
                  <button className="mt-4 rounded-lg w-full bg-gray-100 h-10 text-sm font-light">
                    Réserver
                  </button>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl">
                  <p className="font-medium mb-3">
                    <UsersRound className="text-[#FDD700] inline size-4 mr-2" />{" "}
                    UGC Ciné Cité Les Halles
                  </p>
                  <div className="flex justify-start gap-4 font-light">
                    <span>
                      <Calendar className="inline size-4 text-gray-500 mr-1" />
                      01/01/2025
                    </span>
                    <span>
                      <Clock className="inline size-4 text-gray-500 mr-1" />
                      20h30
                    </span>
                  </div>
                  <button className="mt-4 rounded-lg w-full bg-gray-100 h-10 text-sm font-light">
                    Réserver
                  </button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </main>
  )
}
