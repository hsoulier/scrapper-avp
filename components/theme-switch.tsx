"use client"

import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid"

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="grid place-content-center size-10 shrink-0 border border-gray-100 rounded-2xl">
      {theme === "dark" && (
        <button onClick={() => setTheme("light")}>
          <MoonIcon className="size-5 text-gray-900" />
        </button>
      )}
      {(theme === "light" || !theme) && (
        <button onClick={() => setTheme("dark")}>
          <SunIcon className="size-5 text-gray-900" />
        </button>
      )}
    </div>
  )
}
