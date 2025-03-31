"use client"

import { ImdbIcon } from "@/components/icons/imdb"
import { LetterBoxdIcon } from "@/components/icons/letterboxd"
import { SensCritiqueIcon } from "@/components/icons/sens-critique"

export const MoviePopupRating = () => {
  return (
    <div className="px-3 h-10 bg-gray-100 rounded-2xl flex justify-center items-center text-xs font-light gap-8">
      <div className="flex items-center">
        <ImdbIcon className="w-6 mr-2" />
        <span className="font-semibold">6,6</span>/10
      </div>
      <div className="flex items-center">
        <SensCritiqueIcon className="w-5 mr-2" />
        <span className="font-semibold">5,1</span>/10
      </div>
      <div className="flex items-center">
        <LetterBoxdIcon className="w-5 mr-2" />
        <span className="font-semibold">3,2</span>/5
      </div>
    </div>
  )
}
