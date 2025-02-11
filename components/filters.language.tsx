"use client"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"

const values = [
  { value: "vf", label: "Français" },
  { value: "vost", label: "Version originale" },
] as const

const key = "lang" as const

type Value = (typeof values)[number]["value"]

export const FilterLanguage = () => {
  const [lang, setLang] = useQueryState("lang", parseAsArrayOf(parseAsString))

  const hasValue = lang && lang?.length > 0

  const removeFilter = (value: Value) => {
    if (!lang) return
    setLang(lang.filter((v) => v !== value))
  }
  const addFilter = (value: Value) => {
    setLang([...(lang || []), value])
  }

  return (
    <Popover>
      <PopoverTrigger className="focus:outline-none flex items-center gap-2 px-3 py-[10px] border border-gray-200 rounded-xl text-gray-800">
        Langue{" "}
        {hasValue && (
          <span className="bg-gray-100 rounded-lg px-2.5">{lang?.length}</span>
        )}{" "}
        <ChevronDownIcon className="size-4" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        collisionPadding={20}
        className="p-2 border border-gray-200 bg-gray-background rounded-xl text-gray-700 w-fit"
      >
        {values.map(({ value, label }) => (
          <div
            key={value}
            className="flex flex-1 items-center justify-start gap-2 transition-all [&[data-state=open]>svg]:rotate-180 p-2"
          >
            <Checkbox
              defaultChecked={lang?.includes(value)}
              onClick={(e) => e.stopPropagation()}
              onCheckedChange={(checked) => {
                checked ? addFilter(value) : removeFilter(value)
              }}
            />
            <span className="[[aria-checked=true]~&]:text-gray-white text-gray-700 whitespace-nowrap">
              {label}
            </span>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
