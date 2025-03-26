import { Content } from "@/app/shows/[id]/page.content"
import useSupabaseServer from "@/hooks/use-supabase-server"
import { getShowAggregated } from "@/lib/queries"
import { getQueryClient } from "@/lib/query-client"
import {
  HydrationBoundary,
  queryOptions,
  dehydrate,
} from "@tanstack/react-query"
import { cookies } from "next/headers"

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const queryClient = getQueryClient()

  const cookieStore = await cookies()
  const { id } = await params

  const supabase = useSupabaseServer(cookieStore)

  await queryClient.prefetchQuery(
    queryOptions({
      queryKey: [`show-${id}`],
      queryFn: async () => {
        const response = await getShowAggregated(supabase, id)

        return response
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
