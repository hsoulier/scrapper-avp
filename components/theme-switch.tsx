"use client"

import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline"

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex gap-2 border border-gray-100 px-3 py-2 rounded-2xl">
      <button onClick={() => setTheme("dark")}>
        <MoonIcon
          aria-selected={(theme || "dark") === "dark"}
          className="size-6 aria-selected:text-gray-800 text-gray-300"
        />
      </button>
      <button onClick={() => setTheme("light")}>
        <SunIcon
          aria-selected={theme === "light"}
          className="size-6 aria-selected:text-gray-800 text-gray-300"
        />
      </button>
    </div>
  )
}
