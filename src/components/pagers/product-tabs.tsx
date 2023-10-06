"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { products } from "@/db/schema"

import { TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProudctTabs() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()

  // Search params
  const tab = searchParams?.get("category") ?? "skateboards"

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString())

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      }

      return newSearchParams.toString()
    },
    [searchParams]
  )

  return (
    <TabsList className="mx-auto flex w-fit">
      {Object.values(products.category.enumValues).map((category) => (
        <TabsTrigger
          key={category}
          value={category}
          className="capitalize"
          onClick={() => {
            startTransition(() => {
              router.push(
                `${pathname}?${createQueryString({
                  category: category === tab ? null : category,
                })}`,
                {
                  scroll: false,
                }
              )
            })
          }}
          disabled={isPending}
        >
          {category}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}
