"use client"

import { Logo } from "@/components/logo"
import { ThemeSwitch } from "@/components/theme-switch"

export const Navigation = () => {
  return (
    <nav className="container flex items-center justify-between sticky top-0 pt-6 pb-4 z-50 bg-gray-background">
      <Logo className="h-8" />
      <div className="px-28 py-3 rounded-lg bg-gray-800">
        <input
          type="text"
          placeholder="Rechercher une avant-première ..."
          className="w-full bg-transparent outline-none"
        />
      </div>
      <ThemeSwitch />
    </nav>
  )
}
