import { Content } from "@/app/page.content"
import useSupabaseServer from "@/hooks/use-supabase-server"
import { getShowsAggregatedServer } from "@/lib/queries"
import { cookies } from "next/headers"
type AwaitSearchParams = Promise<{
  [key: string]: string | string[] | undefined
}>

const Page = async ({ searchParams }: { searchParams: AwaitSearchParams }) => {
  const cookieStore = await cookies()
  const supabase = useSupabaseServer(cookieStore)

  const awaitedSearchParams = await searchParams
  const data = await getShowsAggregatedServer(supabase, awaitedSearchParams)

  console.log(data)

  return <Content />
}

export default Page
