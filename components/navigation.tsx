"use client"

import { Logo } from "@/components/logo"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const ThemeSwitch = dynamic(
  () => import("./theme-switch").then((m) => m.ThemeSwitch),
  { ssr: false }
)

export const Navigation = () => {
  const value = useSearchParams().get("q")

  return (
    <nav className="mx-auto px-8 w-full flex items-center justify-between sticky top-0 pt-6 pb-4 z-50 bg-gray-background">
      <Link href="/">
        <Logo className="h-8" />
      </Link>
      <search
        role="search"
        className="lg:absolute left-1/2 lg:-translate-x-1/2 w-fit"
      >
        <form className="relative px-4 lg:px-40 py-3 rounded-lg bg-gray-100">
          <MagnifyingGlassIcon className="hidden size-4 lg:block absolute left-[8.5rem] top-4 text-gray-400" />
          <input
            type="search"
            name="q"
            placeholder="Rechercher une avant-première ..."
            className="w-[40vw] lg:w-72 bg-transparent outline-none placeholder:text-gray-400 text-gray-800"
            defaultValue={value || ""}
          />
        </form>
      </search>
      <ThemeSwitch />
    </nav>
  )
}
