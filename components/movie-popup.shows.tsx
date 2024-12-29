"use client"

import { UGCIcon } from "@/components/icons/ugc"
import { ArrowRightIcon } from "@heroicons/react/24/outline"

export const MoviePopupShow = () => {
  return (
    <div className="bg-gray-background/50 flex-nowrap justify-between items-center border border-gray-200 p-4 rounded-2xl flex">
      <div className="flex flex-nowrap gap-2">
        <UGCIcon /> UGC Ciné Cité Les Halles (1er)
      </div>
      <div className="ml-4">11/11/24</div>
      <div className="ml-4">15:00</div>
      <button className="ml-4 size-8 p-1 rounded-md text-gray-background bg-gray-white">
        <ArrowRightIcon className="size-6" />
      </button>
    </div>
  )
}
