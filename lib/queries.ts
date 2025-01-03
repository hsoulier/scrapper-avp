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

export const getShowsAggregatedServer = async (
  client: TypedSupabaseClient,
  searchParams: {
    [key: string]: string | string[] | undefined
  }
) => {
  const { cinemaId, source, avpType, lang } = searchParams

  let query = client.from("shows").select(
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

  if (cinemaId) {
    query = query.eq("cinema.id", cinemaId)
  }
  if (source) {
    query = query.eq("cinema.source", source)
  }
  if (avpType) {
    query = query.eq("avpType", avpType)
  }
  if (lang) {
    query = query.eq("language", lang)
  }

  return query.order("date")
}

export type ShowAggregated = NonNullable<
  Awaited<ReturnType<typeof getShowsAggregated>>["data"]
>[number]
