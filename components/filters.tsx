"use client"
import { FilterCinema } from "@/components/filters.cinema"
import { FilterLanguage } from "@/components/filters.language"
import { FilterShows } from "@/components/filters.shows"
import { usePathname } from "next/navigation"

export const Filters = () => {
  const isHomePage = usePathname() === "/"

  if (!isHomePage) return null

  return (
    <header className="flex gap-2 pb-4 lg:pb-6 relative z-30 flex-wrap mx-5">
      <FilterCinema />
      <FilterShows />
      <FilterLanguage />
    </header>
  )
}
