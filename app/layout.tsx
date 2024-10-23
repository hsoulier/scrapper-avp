import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { MoviePopup } from "@/components/movie-popup"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

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
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          // "min-h-screen font-sans antialiased grid lg:grid-cols-5",
          "min-h-screen font-sans antialiased",
          inter.variable
        )}
      >
        {/* <aside className="pb-12 hidden lg:block">
          <div className="p-4 space-y-4">
            <Input placeholder="Rechercher un cinéma" />
            <Link href="/cinema">Cinema</Link>
          </div>
        </aside> */}
        <Suspense>
          <main className="col-span-3 lg:col-span-4 lg:border-l p-4">
            {children}
          </main>
          <MoviePopup />
        </Suspense>
      </body>
    </html>
  )
}
