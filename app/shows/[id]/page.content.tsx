"use client"

import { MoviePopupRating } from "@/components/movie-popup.rating"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SOURCE_PROVIDER } from "@/constants/mapping"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { getShowAggregated } from "@/lib/queries"
import { numToTime } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { Calendar, ChevronLeft, Clock, UsersRound } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

export const Content = () => {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const supabase = useSupabaseBrowser()

  const { data, error, status } = useQuery({
    queryKey: [`show-${id}`],
    queryFn: async () => {
      const response = await getShowAggregated(supabase, id)

      return response
    },
  })

  if (status === "pending") {
    return <div>Loading...</div>
  }

  if (status === "error") {
    return <div>Error: {error.message}</div>
  }

  const movie = data?.movie
  const shows = data.shows

  if (!movie) {
    return <div>Movie not found</div>
  }

  return (
    <main className="mx-5 lg:max-w-5xl lg:mx-auto">
      <button
        className="inline-flex items-center gap-1 p-2 text-sm font-light"
        onClick={() => history.back()}
      >
        <ChevronLeft />
        Retour
      </button>
      <div className="flex flex-col gap-8">
        <div className="mt-6 grid grid-cols-5 gap-4 lg:grid-cols-6 lg:gap-12">
          <div className="relative col-span-2 lg:col-span-2">
            <img
              src={movie.poster || ""}
              alt="Movie cover"
              className="object-cover w-64 aspect-[7/10] group-hover:scale-110 transition-transform duration-200 ease-out rounded-2xl lg:w-full"
            />
            <div
              className="opacity-75 bg-no-repeat bg-center bg-cover blur-2xl absolute saturate-200 inset-0 -z-10 transition-opacity duration-150 ease-out"
              style={{ backgroundImage: `url(${movie.poster || ""})` }}
            />
          </div>

          <div className="space-y-4 col-span-3 lg:col-span-4">
            <h1 className="text-2xl font-semibold flex flex-wrap gap-1 lg:flex-nowrap">
              <span className="truncate">{movie.title}</span>
              {/* <span className="flex-shrink-0 font-normal lg:ml-4 bg-gray-100 inline-flex gap-2 p-2 rounded-xl text-xs">
              <UserGroupIcon className="size-4 text-gray-500" />
              {mappingAVP[show?.avpType as keyof typeof mappingAVP]}
            </span> */}
            </h1>

            <div className="space-y-3">
              <div className="gap-1 flex flex-col">
                <span className="font-light text-gray-500">Réalisé par</span>
                <span className="font-light">{movie.director}</span>
              </div>

              <div className="gap-1 flex flex-col">
                <span className="font-light text-gray-500">
                  Sortie prévue le
                </span>

                <span className="font-light">
                  {new Date(movie.release || "").toLocaleDateString("fr-FR")}
                </span>
              </div>

              <div className="gap-1 flex flex-col">
                <span className="font-light text-gray-500">Durée</span>
                <span className="font-light">
                  {numToTime(movie.duration || 0)}
                </span>
              </div>

              <div className="gap-1 flex-col hidden lg:flex">
                <span className="font-light text-gray-500">Synopsis</span>
                <p className="font-light">{movie.synopsis}</p>
              </div>
            </div>
          </div>
        </div>
        {/* <MoviePopupRating /> */}
        <div className="gap-1 flex flex-col lg:hidden">
          <span className="font-light text-gray-500">Synopsis</span>
          <p className="font-light">{movie.synopsis}</p>
        </div>
      </div>
      <section className="flex flex-col gap-12 my-12">
        <div className="flex gap-3">
          <button className="h-10 px-3 rounded-lg border border-transparent bg-gray-100 font-medium text-sm">
            Toutes les séances
          </button>
          <button className="h-10 px-3 rounded-lg border border-primary-yellow/10 text-primary-yellow/50 iline-flex items-center gap-2">
            <UsersRound className="inline size-4 mr-2" />
            Avec l'équipe du film
          </button>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(shows).map(([key, value]) => (
            <AccordionItem value={key} key={key} className="border-none py-0">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center justify-start w-full gap-1 hover:no-underline">
                  <span className="text-2xl font-semibold">
                    {SOURCE_PROVIDER[key as keyof typeof SOURCE_PROVIDER]}
                  </span>
                  <span className="text-2xl font-light">({value?.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-6 pt-6 lg:grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
                  {value?.map((show, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-100 rounded-xl"
                    >
                      <p className="font-medium mb-3">
                        {/* <UsersRound className="text-primary-yellow inline size-4 mr-2" />{" "} */}
                        {show.cinemas.name}
                      </p>
                      <div className="flex justify-start gap-4 font-light">
                        <span>
                          <Calendar className="inline size-4 text-gray-500 mr-1" />
                          {new Date(show.date || "").toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                        <span>
                          <Clock className="inline size-4 text-gray-500 mr-1" />
                          {new Date(show.date || "").toLocaleTimeString(
                            "fr-FR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                      <button
                        onClick={() => router.push(show.linkShow || "")}
                        className="mt-4 rounded-lg w-full bg-gray-100 h-10 text-sm font-light"
                      >
                        Réserver
                      </button>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  )
}
