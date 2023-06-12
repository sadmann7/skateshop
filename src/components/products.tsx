"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
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
      <div className="flex items-center space-x-2">
        <Button size="sm">Filter</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Sort by" size="sm">
              Sort
              <Icons.chevronDown className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.label}
                className={cn(
                  option.value === sort && option.order === order && "font-bold"
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.products.map((product) => (
              <Card key={product.id} className="overflow-hidden rounded-none">
                <Link
                  aria-label={`View ${product.name} details`}
                  href={`/products/${product.id}`}
                >
                  <CardHeader className="border-b p-0">
                    <AspectRatio ratio={4 / 3}>
                      {product?.images?.length ? (
                        <Image
                          src={
                            product.images[0]?.url ??
                            '"/images/product-placeholder.webp"'
                          }
                          alt={product.images[0]?.name ?? "Product image"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-secondary">
                          <Icons.placeholder
                            className="h-9 w-9 text-muted-foreground"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </AspectRatio>
                  </CardHeader>
                </Link>
                <Link
                  aria-label={`View ${product.name} details`}
                  href={`/products/${product.id}`}
                >
                  <CardContent className="grid gap-2.5 p-4">
                    <CardTitle className="line-clamp-1">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {formatPrice(product.price)}
                    </CardDescription>
                  </CardContent>
                </Link>
                <CardFooter className="p-4">
                  <div className="flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-between">
                    <Button
                      aria-label="Quick view"
                      variant="outline"
                      size="sm"
                      className="h-8 w-full rounded-none"
                    >
                      Quick view
                    </Button>
                    <Button
                      aria-label="Add to cart"
                      size="sm"
                      className="h-8 w-full rounded-none"
                    >
                      Add to cart
                    </Button>
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
