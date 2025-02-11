import type { TypedSupabaseClient } from "@/types/supabase"

export const getShowsAggregated = async (
  client: TypedSupabaseClient,
  searchParams: {
    [key: string]: string | string[] | undefined
  }
) => {
  const { cinemaId, source, avpType, lang, q } = searchParams
  const now = new Date().toISOString()

  let query = client
    .from("movies")
    .select(`movie_id:id,title, poster,release,shows(*)`)

  // TODO: Reimplement
  // if ("cinemaId" in searchParams && cinemaId) {
  //   query = query.eq("cinemas.slug", cinemaId)
  // }
  // if ("source" in searchParams && source) {
  //   query = query.eq("cinemas.source", source)
  // }
  if ("avpType" in searchParams && avpType) {
    query = query.eq("shows.avpType", avpType.toString())
  }
  if ("lang" in searchParams && lang) {
    query = query.eq("shows.language", lang.toString())
  }

  if ("q" in searchParams && q) {
    query = query.ilike("title", `%${q}%`)
  }

  return query.gt("release", now).order("release").not("shows", "is", null)
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
