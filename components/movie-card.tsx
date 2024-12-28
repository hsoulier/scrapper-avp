"use client"

import { UGCIcon } from "@/components/icons/ugc"

export const MovieCard = () => {
  return (
    <article className="group relative after:z-10 after:inset-0 after:absolute after:content-[''] after:bg-gradient-to-b after:from-0% after:from-transparent after:via-black/70 after:via-40% after:to-black after:to-100% after:rounded-[inherit] rounded-xl w-full aspect-[9/16] cursor-pointer">
      <div className="size-full bg-center bg-cover rounded-[inherit] overflow-hidden">
        <img
          src="https://m.media-amazon.com/images/M/MV5BMjQwM2Q5Y2ItNjJjNy00OGI2LWIxMmItY2ZkZmE4NjZiZGMyXkEyXkFqcGc@._V1_.jpg"
          alt="Movie cover"
          className="object-cover size-full group-hover:scale-110 transition-transform duration-200 ease-out"
        />
      </div>
      <div
        className="opacity-0 group-hover:opacity-20 bg-no-repeat bg-center bg-cover blur-xl absolute saturate-200 -inset-0 -z-10 transition-opacity duration-150 delay-75 ease-out"
        style={{
          backgroundImage:
            "url(https://m.media-amazon.com/images/M/MV5BMjQwM2Q5Y2ItNjJjNy00OGI2LWIxMmItY2ZkZmE4NjZiZGMyXkEyXkFqcGc@._V1_.jpg)",
        }}
      />
      <span className="absolute top-4 right-4 bg-gray-background p-0.5 rounded-lg">
        <UGCIcon />
      </span>
      <header className="absolute bottom-4 inset-x-4 space-y-1 z-20">
        <h3 className="text-lg font-semibold">My Sunshine</h3>
        <p className="text-sm font-light flex justify-between">
          <span>20h30</span>
          <span>11/11/2024</span>
        </p>
      </header>
    </article>
  )
}
