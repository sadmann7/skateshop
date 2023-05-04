import { clsx, type ClassValue } from "clsx"
import dayjs from "dayjs"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEnum(value: string) {
  return value
    .split("_")
    .map((word) => (word[0] as string) + word.slice(1).toLowerCase())
    .join(" ")
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

export function formatDate(date: Date) {
  return dayjs(date).format("MMMM D, YYYY")
}
