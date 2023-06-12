"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { type Product } from "@/db/schema"

import { sortOptions } from "@/config/products"
import { cn, formatPrice } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"
import { PaginationButton } from "@/components/pagination-button"

interface ProductsProps {
  data: Product[]
  pageCount: number
}

export function Products({ data, pageCount }: ProductsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()

  // Search params
  const page = searchParams?.get("page") ?? "1"
  const per_page = searchParams?.get("per_page") ?? "10"
  const sort = searchParams?.get("sort") ?? "createdAt"
  const order = searchParams?.get("order") ?? "asc"

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
    <div className="flex flex-col space-y-6">
      <div className="flex items-center space-x-2">
        <Button size="sm" disabled={isPending}>
          Filter
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Sort by" size="sm" disabled={isPending}>
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isPending
          ? Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden rounded-none">
                <CardHeader className="border-b p-0">
                  <AspectRatio ratio={4 / 3}>
                    <div className="flex h-full items-center justify-center bg-secondary">
                      <Icons.placeholder
                        className="h-9 w-9 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                  </AspectRatio>
                </CardHeader>
                <CardContent className="grid gap-2.5 p-4">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
                <CardFooter className="p-4">
                  <div className="flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-between">
                    <Skeleton className="h-8 w-full rounded-none" />
                    <Skeleton className="h-8 w-full rounded-none" />
                  </div>
                </CardFooter>
              </Card>
            ))
          : data.map((product) => (
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
      </div>
      <PaginationButton
        pageCount={pageCount}
        page={page}
        per_page={per_page}
        sort={sort}
        order={order}
        createQueryString={createQueryString}
        router={router}
        pathname={pathname}
        isPending={isPending}
        startTransition={startTransition}
      />
    </div>
  )
}
