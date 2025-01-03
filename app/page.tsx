import { MovieCard } from "@/components/movie-card"
import useSupabaseServer from "@/hooks/use-supabase-server"
import { getShowsAggregatedServer } from "@/lib/queries"
import { cookies } from "next/headers"
type AwaitSearchParams = Promise<{
  [key: string]: string | string[] | undefined
}>

const Page = async ({ searchParams }: { searchParams: AwaitSearchParams }) => {
  const cookieStore = await cookies()
  const awaitedSearchParams = await searchParams

  const supabase = useSupabaseServer(cookieStore)

  const res = await getShowsAggregatedServer(supabase, awaitedSearchParams)

  console.log(res?.data, awaitedSearchParams)

  // return res?.data?.map((show) => <div key={show.id}>{show.movies.title}</div>)

  return res?.data?.map((show) => <MovieCard key={show.id} show={show} />)
}

export default Page
