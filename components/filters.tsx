"use client"
import { FilterCinema } from "@/components/filters.cinema"
import { FilterLanguage } from "@/components/filters.language"
import { FilterShows } from "@/components/filters.shows"
import { usePathname } from "next/navigation"

export const Filters = () => {
  const isHomePage = usePathname() === "/"

  if (!isHomePage) return null

  return (
    <header className="lg:px-8 w-full flex gap-2 pb-2 lg:pb-6 relative z-30 flex-wrap mx-5">
      <FilterCinema />
      <FilterShows />
      {/* <FilterLocation /> */}
      <FilterLanguage />
    </header>
  )
}
