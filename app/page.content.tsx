"use client"

import { MovieCard } from "@/components/movie-card"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { getShowsAggregated } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"

export const Content = () => {
  const supabase = useSupabaseBrowser()
  const { data: res } = useQuery({
    queryKey: ["shows"],
    queryFn: () => getShowsAggregated(supabase),
  })

  console.log(res?.data)

  return res?.data?.map((show) => <MovieCard key={show.id} show={show} />)
}
