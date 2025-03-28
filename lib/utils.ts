import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const openInNewTab = (url: string) => {
  const win = window.open(url, "_blank")
  if (win) win.focus()
}

export class SuperParams extends URLSearchParams {
  constructor(init?: ConstructorParameters<typeof URLSearchParams>[0]) {
    super(init)
  }

  toggle = (key: string, value: string) => {
    if (this.get(key) === value) {
      this.delete(key)
      return
    }
    this.set(key, value)
  }
}

export const formatTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h${minutes.toString().padStart(2, "0")}`
}
