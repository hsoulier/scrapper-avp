import { Suspense } from "react"
import type { Metadata } from "next"
import { Bricolage_Grotesque } from "next/font/google"
import { Providers } from "@/app/providers"
import { Filters } from "@/components/filters"
import { Navigation } from "@/components/navigation"
import { cn } from "@/lib/utils"
import "./globals.css"

const font = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Avant première Paris",
  description: "Découvrez les avant-premières de films à Paris",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "dark:text-gray-white bg-gray-background min-h-screen font-sans antialiased",
          font.variable
        )}
      >
        <Providers>
          <Suspense>
            <Navigation />
            <Filters />
            <main className="gap-8 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] mx-[3%] my-4 lg:my-8">
              {children}
            </main>
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}
