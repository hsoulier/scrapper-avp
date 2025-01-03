import type { TypedSupabaseClient } from "@/types/supabase"

export const getShowsAggregated = async (
  client: TypedSupabaseClient,
  searchParams: {
    [key: string]: string | string[] | undefined
  }
) => {
  const { cinemaId, source, avpType, lang, q } = searchParams

  let query = client.from("shows").select(
    `
    *,
    cinemas!inner(*),
    movies!inner(*)
    `
  )

  if ("cinemaId" in searchParams && cinemaId) {
    query = query.eq("cinemas.slug", cinemaId)
  }
  if ("source" in searchParams && source) {
    query = query.eq("cinemas.source", source)
  }
  if ("avpType" in searchParams && avpType) {
    query = query.eq("avpType", avpType)
  }
  if ("lang" in searchParams && lang) {
    query = query.eq("language", lang)
  }

  if ("q" in searchParams && q) {
    query = query.ilike("movies.title", `%${q}%`)
  }

  return query.order("date")
}

export const getShowAggregated = async (
  client: TypedSupabaseClient,
  id: string
) => {
  return client
    .from("shows")
    .select(
      `
    *,
    cinemas!inner(*),
    movies!inner(*)
    `
    )
    .eq("id", id)
    .single()
}

export type ShowAggregated = NonNullable<
  Awaited<ReturnType<typeof getShowsAggregated>>["data"]
>[number]
