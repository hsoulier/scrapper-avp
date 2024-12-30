"use client"

import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex gap-2 border border-gray-100 px-3 py-2 rounded-2xl">
      <button onClick={() => setTheme("dark")}>
        <MoonIcon
          className={cn(
            "size-6  text-gray-300",
            theme === "dark" && "text-gray-800"
          )}
        />
      </button>
      <button onClick={() => setTheme("light")}>
        <SunIcon
          className={cn(
            "size-6  text-gray-300",
            theme === "light" && "text-gray-800"
          )}
        />
      </button>
    </div>
  )
}
