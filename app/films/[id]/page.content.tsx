"use client"

import { MovieCard } from "@/components/movie-card"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { getMovieAggregated, getShowsAggregated } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
import { useParams, useSearchParams } from "next/navigation"

export const Content = () => {
  const params = useParams<{ id: string }>()

  const supabase = useSupabaseBrowser()

  const { data } = useQuery({
    queryKey: [`film-${params.id}`],
    queryFn: async () => {
      const response = await getMovieAggregated(supabase, parseInt(params.id))

      return response.data
    },
  })

  console.log(data)

  return null
  // <>
  //   {data?.map((movie) => (
  //     <MovieCard key={movie.movie_id} movie={movie} />
  //   ))}
  //   {/* <MoviePopup /> */}
  // </>
}
