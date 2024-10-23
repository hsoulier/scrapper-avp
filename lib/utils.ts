import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const openInNewTab = (url: string) => {
  const win = window.open(url, "_blank")
  if (win) win.focus()
}
