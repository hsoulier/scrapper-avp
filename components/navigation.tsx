"use client"

import { Logo } from "@/components/logo"
import { ThemeSwitch } from "@/components/theme-switch"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export const Navigation = () => {
  const value = useSearchParams().get("film")

  return (
    <nav className="container flex items-center justify-between sticky top-0 pt-6 pb-4 z-50 bg-gray-background">
      <Link href="/">
        <Logo className="h-8" />
      </Link>
      <search role="search">
        <form className="relative px-40 py-3 rounded-lg bg-gray-100">
          <MagnifyingGlassIcon className="size-4 absolute left-[8.5rem] top-4 text-gray-400" />
          <input
            type="search"
            name="film"
            placeholder="Rechercher une avant-première ..."
            className="w-72 bg-transparent outline-none placeholder:text-gray-400 text-gray-800"
            defaultValue={value || ""}
          />
        </form>
      </search>
      <ThemeSwitch />
    </nav>
  )
}
