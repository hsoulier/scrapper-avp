import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Navigation } from "@/components/navigation"
import { Filters } from "@/components/filters"

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
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "bg-gray-background min-h-screen font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <Filters />
          <main className="container gap-8 grid grid-cols-3 lg:grid-cols-6">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
