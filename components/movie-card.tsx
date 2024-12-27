"use client"

import { UGCIcon } from "@/components/icons/ugc"

export const MovieCard = () => {
  return (
    <article className="shadow-[0_0_20px_3px_rgba(0,0,0,0.25)] relative bg-gradient-to-b from-0% from-transparent via-black/70 via-40% to-black to-100% rounded-xl">
      <img
        src="https://m.media-amazon.com/images/M/MV5BMjQwM2Q5Y2ItNjJjNy00OGI2LWIxMmItY2ZkZmE4NjZiZGMyXkEyXkFqcGc@._V1_.jpg"
        alt="movie cover"
        className="rounded-xl w-full relative -z-10"
      />
      <span className="absolute top-4 right-4 bg-gray-background p-0.5 rounded-lg">
        <UGCIcon />
      </span>
      <header className="absolute bottom-4 inset-x-4 space-y-1">
        <h3 className="text-lg font-semibold">My Sunshine</h3>
        <p className="text-sm font-light flex justify-between">
          <span>20h30</span>
          <span>11/11/2024</span>
        </p>
      </header>
    </article>
  )
}
