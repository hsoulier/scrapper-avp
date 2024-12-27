"use client"

import {
  CheckIcon,
  ChevronDownIcon,
  FilmIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useState } from "react"

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

type Value = (typeof values)[number]["value"]

export const FilterCinema = () => {
  const [itemSelected, setItemSelected] = useState<Value>()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl text-gray-800">
        Cinéma <ChevronDownIcon className="size-4" />
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
            onCheckedChange={() => setItemSelected(value)}
            className="relative flex items-center py-2 gap-2 pl-10 pr-2 rounded-lg aria-checked:bg-gray-100 aria-checked:text-gray-white cursor-pointer"
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
