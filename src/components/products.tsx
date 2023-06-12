"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { type Product } from "@/db/schema"

import { sortOptions } from "@/config/products"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

interface ProductsProps {
  products: Product[]
  nextCursor?: number
}

export function Products({ products, nextCursor }: ProductsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()

  // Search params
  const sort = searchParams.get("sort") ?? "createdAt"
  const order = searchParams.get("order") ?? "desc"
  const price = searchParams.get("price")
  const storeIds = searchParams.get("storeIds")?.split(",")

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
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button size="sm">Filter</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Sort by" size="sm">
                Sort
                <Icons.chevronDown
                  className="ml-2 h-4 w-4"
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.label}
                  className={cn(
                    option.value === sort &&
                      option.order === order &&
                      "font-bold"
                  )}
                  onClick={() => {
                    startTransition(() => {
                      router.push(
                        `${pathname}?${createQueryString({
                          sort: option.value,
                          order: option.order,
                        })}`
                      )
                    })
                  }}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{product.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => {
                  router.push(`/products/${product.id}`)
                }}
              >
                View
              </Button>
            </CardFooter>
          </Card>
        ))}
        <div className="flex items-center justify-center">
          {nextCursor && (
            <Button
              onClick={() => {
                startTransition(() => {
                  router.push(
                    `${pathname}?${createQueryString({
                      cursor: nextCursor,
                    })}`
                  )
                })
              }}
              disabled={isPending}
            >
              {isPending && (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Load more
            </Button>
          )}
          {!nextCursor && <span>No more products</span>}
          {!products.length && <span>No products found</span>}
          {!searchParams && <span>Invalid search params</span>}
        </div>
      </div>
    </div>
  )
}
