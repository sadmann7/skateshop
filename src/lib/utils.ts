import { env } from "@/env.mjs"
import type { CartLineItem } from "@/types"
import { isClerkAPIResponseError } from "@clerk/nextjs"
import { clsx, type ClassValue } from "clsx"
import dayjs from "dayjs"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"
import * as z from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number | string,
  currency: "USD" | "EUR" | "GBP" | "BDT" = "USD",
  notation: "compact" | "engineering" | "scientific" | "standard" = "standard"
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
  }).format(Number(price))
}

export function formatDate(date: Date | string | number) {
  return dayjs(date).format("MMMM D, YYYY")
}

export function formatBytes(
  bytes: number,
  decimals = 0,
  sizeType: "accurate" | "normal" = "normal"
) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

export function unslugify(str: string) {
  return str.replace(/-/g, " ")
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  )
}

export function toSentenceCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

export function isArrayOfFile(files: unknown): files is File[] {
  const isArray = Array.isArray(files)
  if (!isArray) return false
  return files.every((file) => file instanceof File)
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

export function formatOrderId(orderId: number) {
  return `#${orderId.toString().padStart(6, "0")}`
}

export function catchError(err: unknown) {
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message
    })
    return toast(errors.join("\n"))
  } else if (err instanceof Error) {
    return toast(err.message)
  } else {
    return toast("Something went wrong, please try again later.")
  }
}

export function catchClerkError(err: unknown) {
  const unknownErr = "Something went wrong, please try again later."

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message
    })
    return toast(errors.join("\n"))
  } else if (isClerkAPIResponseError(err)) {
    return toast.error(err.errors[0]?.longMessage ?? unknownErr)
  } else {
    return toast.error(unknownErr)
  }
}

export function isMacOs() {
  if (typeof window === "undefined") return false

  return window.navigator.userAgent.includes("Mac")
}

// Original source: https://github.com/jackblatch/OneStopShop/blob/main/server-actions/stripe/payment.ts
export function calculateOrderAmount(items: CartLineItem[]) {
  const total = items.reduce((acc, item) => {
    return acc + Number(item.price) * item.quantity
  }, 0)
  const fee = Math.round(total * 0.1)

  const totalInCents = Math.round(total * 100)
  const feeInCents = Math.round(fee * 100)

  return {
    total: totalInCents, // Converts to cents which stripe charges in
    fee: feeInCents,
  }
}
