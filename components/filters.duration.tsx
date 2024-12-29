"use client"

import { ChevronDownIcon } from "@heroicons/react/24/outline"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

export const FilterDuration = () => {
  return null

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="focus:outline-none flex items-center gap-2 p-3 border border-gray-200 rounded-xl text-gray-800">
        Durée <ChevronDownIcon className="size-4" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        align="start"
        sideOffset={14}
        className="p-2 border border-gray-200 bg-gray-background rounded-xl text-gray-700"
      ></DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
