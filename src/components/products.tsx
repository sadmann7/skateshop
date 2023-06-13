"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { type Product } from "@/db/schema"

import { sortOptions } from "@/config/products"
import { cn, formatPrice } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
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
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
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

  // Handle price filter
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 100])
  const debouncedPrice = useDebounce(priceRange, 500)

  React.useEffect(() => {
    const [min, max] = debouncedPrice
    router.push(
      `${pathname}?${createQueryString({
        price: `${min},${max}`,
      })}`
    )
  }, [debouncedPrice, createQueryString, pathname, router])

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center space-x-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              aria-label="Filter products"
              size="sm"
              className="rounded-sm"
              disabled={isPending}
            >
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <Separator className="my-4" />
            <div className="space-y-4">
              <SheetDescription>Price</SheetDescription>
              <Slider
                variant="range"
                defaultValue={[0, 100]}
                max={100}
                step={1}
                value={priceRange}
                onValueChange={(value: typeof priceRange) => {
                  setPriceRange(value)
                }}
              />
              <div className="flex items-center space-x-4">
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    setPriceRange([value, priceRange[1]])
                  }}
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    setPriceRange([priceRange[0], value])
                  }}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Sort products"
              size="sm"
              className="rounded-sm"
              disabled={isPending}
            >
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
              <Card key={i} className="rounded-sm">
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
                    <Skeleton className="h-8 w-full rounded-sm" />
                    <Skeleton className="h-8 w-full rounded-sm" />
                  </div>
                </CardFooter>
              </Card>
            ))
          : data.map((product) => (
              <Card key={product.id} className="overflow-hidden rounded-sm">
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
                          loading="lazy"
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
                      className="h-8 w-full rounded-sm"
                    >
                      Quick view
                    </Button>
                    <Button
                      aria-label="Add to cart"
                      size="sm"
                      className="h-8 w-full rounded-sm"
                    >
                      Add to cart
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
      </div>
      <PaginationButton
        className="mx-auto"
        pageCount={pageCount}
        page={page}
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
