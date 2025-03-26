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
    <nav className="flex items-center justify-between sticky top-0 py-6 z-50 px-5 space-x-5">
      <Link href="/">
        <Logo className="h-8" />
      </Link>
      <search
        role="search"
        className="grow lg:absolute left-1/2 lg:-translate-x-1/2"
      >
        <form className="grow relative pl-8 lg:px-40 h-10 rounded-2xl bg-gray-100">
          <MagnifyingGlassIcon className="size-4 left-2 lg:block absolute lg:left-[8.5rem] top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            name="q"
            placeholder="Rechercher ..."
            className="min-w-0 w-fit h-full lg:w-72 bg-transparent outline-none placeholder:text-gray-400 text-gray-800"
            defaultValue={value || ""}
          />
        </form>
      </search>
      <ThemeSwitch />
    </nav>
  )
}
