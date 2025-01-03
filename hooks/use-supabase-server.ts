import type { Database } from "@/types/supabase"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export default function useSupabaseServer(
  cookieStore: Awaited<ReturnType<typeof cookies>>
) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
