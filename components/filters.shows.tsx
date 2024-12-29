"use client"

import { SuperParams } from "@/lib/utils"
import {
  CheckIcon,
  ChevronDownIcon,
  FilmIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useSearchParams } from "next/navigation"

const values = [
  { value: "AVP", label: "AVP classiques", Icon: FilmIcon },
  {
    value: "AVP-real",
    label: "AVP en présence du réalisateur",
    Icon: UserIcon,
  },
  {
    value: "AVP-team",
    label: "AVP en présence du casting",
    Icon: UserGroupIcon,
  },
] as const

const key = "shows" as const

type Value = (typeof values)[number]["value"]

export const FilterShows = () => {
  const searchParams = useSearchParams()

  const itemSelected = searchParams.get(key) as Value | null

  const updateFilter = (value: Value) => {
    const params = new SuperParams(searchParams.toString())
    params.toggle(key, value)

    window.history.pushState(null, "", `?${params.toString()}`)
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="focus:outline-none flex items-center gap-2 px-3 py-[10px] border border-gray-200 rounded-xl text-gray-800">
        Type de séances <ChevronDownIcon className="size-4" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        align="start"
        sideOffset={14}
        className="p-2 border border-gray-200 bg-gray-background rounded-xl text-gray-700"
      >
        {values.map(({ value, label, Icon }) => (
          <DropdownMenu.CheckboxItem
            key={value}
            checked={itemSelected === value}
            onCheckedChange={() => updateFilter(value)}
            className="relative flex items-center py-2 gap-2 pl-10 pr-2 rounded-lg aria-checked:bg-gray-100 aria-checked:text-gray-white cursor-pointer hover:bg-gray-100 transition-colors duration-100 ease-out hover:outline-none"
          >
            <DropdownMenu.ItemIndicator asChild>
              <CheckIcon className="size-4 absolute left-4 top-1/2 -translate-y-2" />
            </DropdownMenu.ItemIndicator>
            <Icon className="size-4" />
            {label}
          </DropdownMenu.CheckboxItem>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
