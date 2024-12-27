import { FilterCinema } from "@/components/filters.cinema"
import { FilterDuration } from "@/components/filters.duration"
import { FilterLanguage } from "@/components/filters.language"
import { FilterLocation } from "@/components/filters.location"
import { FilterShows } from "@/components/filters.shows"

export const Filters = () => {
  return (
    <header className="container flex gap-2 pb-6">
      <FilterCinema />
      <FilterShows />
      <FilterLocation />
      <FilterLanguage />
      <FilterDuration />
    </header>
  )
}
