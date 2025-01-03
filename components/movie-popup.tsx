"use client"

import { MoviePopupInfo } from "@/components/movie-popup.info"
import { MoviePopupRating } from "@/components/movie-popup.rating"
import { MoviePopupShow } from "@/components/movie-popup.shows"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { getShowAggregated } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"

export const MoviePopup = () => {
  const searchParams = useSearchParams()

  const supabase = useSupabaseBrowser()

  const id = searchParams.get("id") || ""

  const { data: show } = useQuery({
    queryKey: ["show", id],
    enabled: Boolean(id),
    queryFn: async () => (await getShowAggregated(supabase, id))?.data,
  })

  if (!show) return null

  const cover = show.movies.poster || ""

  const closeModal = () => {
    const sq = new URLSearchParams(searchParams.toString())
    sq.delete("id")
    window.history.pushState(null, "", `?${sq.toString()}`)
  }

  return (
    <Dialog open onOpenChange={(open) => !open && closeModal()}>
      <DialogTrigger className="hidden pointer-events-none">open</DialogTrigger>
      <DialogContent className="mx-4 fixed border border-gray-100 bg-gray-background text-gray-white flex-col md:flex-row backdrop:bg-black/50 backdrop:backdrop-blur-sm rounded-3xl p-12 flex gap-10 w-auto xl:w-[64rem] outline-none">
        <div className="flex flex-col items-center flex-shrink-0 gap-4">
          <div className="relative">
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
          <MoviePopupRating />
        </div>
        <div className="space-y-6 flex-grow">
          <MoviePopupInfo show={show} />
          <MoviePopupShow show={show} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
