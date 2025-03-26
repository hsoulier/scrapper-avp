import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function numToTime(num: number) {
  const hours = Math.floor(num / 60)
  let minutes: string | number = num % 60
  if (minutes + "".length < 2) {
    minutes = "0" + minutes
  }
  return hours + "h" + minutes
}
