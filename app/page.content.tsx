"use client"

import { MovieCard } from "@/components/movie-card"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { getShowsAggregated } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"

export const Content = () => {
  const searchParams = useSearchParams()

  const supabase = useSupabaseBrowser()

  const options = Object.fromEntries(searchParams)

  const { data } = useQuery({
    queryKey: [
      "shows",
      `cinemaId-${searchParams.get("cinemaId") || ""}`,
      `source-${searchParams.get("source") || ""}`,
      `avpType-${searchParams.get("avpType") || ""}`,
      `lang-${searchParams.get("lang") || ""}`,
      `q-${searchParams.get("q") || ""}`,
    ],
    queryFn: async () => {
      const response = await getShowsAggregated(supabase, options)

      return response.data
    },
  })

  return (
    <>
      {data?.map((movie) => (
        <MovieCard key={movie.movie_id} movie={movie} />
      ))}
      {/* <MoviePopup /> */}
    </>
  )
}
