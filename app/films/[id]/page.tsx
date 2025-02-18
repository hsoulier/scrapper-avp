import { Content } from "@/app/films/[id]/page.content"
import useSupabaseServer from "@/hooks/use-supabase-server"
import { getMovieAggregated, getShowsAggregated } from "@/lib/queries"
import { getQueryClient } from "@/lib/query-client"
import {
  dehydrate,
  HydrationBoundary,
  queryOptions,
} from "@tanstack/react-query"
import { cookies } from "next/headers"

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const queryClient = getQueryClient()

  const cookieStore = await cookies()
  const awaitedParams = await params

  const supabase = useSupabaseServer(cookieStore)

  await queryClient.prefetchQuery(
    queryOptions({
      queryKey: [`film-${awaitedParams.id}`],
      queryFn: async () => {
        const response = await getMovieAggregated(
          supabase,
          parseInt(awaitedParams.id)
        )

        return response.data
      },
    })
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Content />
    </HydrationBoundary>
  )
}

export default Page
