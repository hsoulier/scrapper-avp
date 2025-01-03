import { FilterCinema } from "@/components/filters.cinema"
import { FilterLanguage } from "@/components/filters.language"
import { FilterLocation } from "@/components/filters.location"
import { FilterShows } from "@/components/filters.shows"

export const Filters = () => {
  return (
    <header className="mx-auto px-8 w-full  flex gap-2 pb-6 relative z-30">
      <FilterCinema />
      <FilterShows />
      <FilterLocation />
      <FilterLanguage />
    </header>
  )
}
