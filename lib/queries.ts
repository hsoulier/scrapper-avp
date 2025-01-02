import type { TypedSupabaseClient } from "@/types/supabase"

export const getShowsAggregated = async (client: TypedSupabaseClient) =>
  client.from("shows").select(
    `
    *,
    ...cinemas!inner(
      cinemaName:name,
      cinemaSource:source,
      cinemaArrondissement:arrondissement
    ),
    ...movies!inner(
      movieTitle:title,
      moviePoster:poster,
      movieDirector:director,
      movieRelease:release,
      movieDuration:duration,
      movieSynopsis:synopsis
    )
    `
  )

export type ShowAggregated = NonNullable<
  Awaited<ReturnType<typeof getShowsAggregated>>["data"]
>[number]
