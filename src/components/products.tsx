"use client"

import * as React from "react"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { type Product } from "@/db/schema"
import { useInfiniteQuery } from "@tanstack/react-query"

import { sortOptions } from "@/config/products"
import { cn, formatPrice } from "@/lib/utils"
import { getProductsSchema } from "@/lib/validations/product"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
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
import { getProductsAction } from "@/app/_actions/product"

import { AspectRatio } from "./ui/aspect-ratio"

interface ProductsProps {
  category: Product["category"]
}

export function Products({ category }: ProductsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()
  const intersectionRef = React.useRef<HTMLDivElement>(null)
  const intersectionEntry = useIntersectionObserver(intersectionRef, {
    threshold: 0,
  })
  const isIntersecting = !!intersectionEntry?.isIntersecting

  // Search params
  const sort =
    getProductsSchema.shape.sort.parse(searchParams.get("sort")) ?? "createdAt"
  const order =
    getProductsSchema.shape.order.parse(searchParams.get("order")) ?? "desc"
  const priceRange = getProductsSchema.shape.priceRange.parse(
    searchParams.get("priceRange")
  )
  const storeIds = getProductsSchema.shape.storeIds.parse(
    searchParams.get("storeIds")
  )

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

  // Fetch products
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", category, sort, order, priceRange, storeIds],
    queryFn: async ({ pageParam = null }) => {
      const data = await getProductsAction({
        category,
        sort,
        order,
        priceRange,
        storeIds,
      })
      return data
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnWindowFocus: false,
  })

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.products.map((product) => (
              <Card key={product.id} className="flex flex-col justify-between">
                {product.images?.length && (
                  <CardHeader>
                    <AspectRatio ratio={1}>
                      <Image
                        src={
                          product.images[0]?.url ?? "/product-placeholder.svg"
                        }
                        alt={
                          product.images[0]?.name ?? "Product placeholder image"
                        }
                        fill
                        className="object-cover"
                      />
                    </AspectRatio>
                  </CardHeader>
                )}
                <CardContent>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center justify-between">
                    <div className="text-gray-700">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
