"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { CuratedStore } from "@/types"
import { ChevronDownIcon, Cross2Icon } from "@radix-ui/react-icons"

import { storeSortOptions, storeStatusOptions } from "@/config/store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StoreCard } from "@/components/cards/store-card"
import { PaginationButton } from "@/components/pagination-button"

import { FacetedFilter } from "./faceted-filter"

interface StoresProps {
  stores: CuratedStore[]
  pageCount: number
}

export function Stores({ stores, pageCount }: StoresProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()

  // Search params
  const page = searchParams?.get("page") ?? "1"
  const per_page = searchParams?.get("per_page") ?? "8"
  const sort = searchParams?.get("sort") ?? "productCount.desc"
  const statuses = searchParams?.get("statuses")

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

  // Store status filter
  const [filterValues, setFilterValues] = React.useState<string[]>(
    statuses ? statuses?.split(".") : []
  )

  React.useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        statuses: filterValues?.length ? filterValues.join(".") : null,
      })

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false,
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValues])

  return (
    <section className="flex flex-col space-y-6">
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Sort stores" size="sm" disabled={isPending}>
              Sort
              <ChevronDownIcon className="ml-2 size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {storeSortOptions.map((option) => (
              <DropdownMenuItem
                key={option.label}
                className={cn(option.value === sort && "font-bold")}
                onClick={() => {
                  startTransition(() => {
                    router.push(
                      `${pathname}?${createQueryString({
                        sort: option.value,
                      })}`,
                      {
                        scroll: false,
                      }
                    )
                  })
                }}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-1 items-center space-x-2">
          <FacetedFilter
            title="Status"
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            options={storeStatusOptions}
          />
          {filterValues.length > 0 && (
            <Button
              aria-label="Reset filters"
              variant="ghost"
              className="h-8 px-2 lg:px-3"
              onClick={() => setFilterValues([])}
            >
              Reset
              <Cross2Icon className="ml-2 size-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
      {!isPending && !stores.length ? (
        <div className="mx-auto flex max-w-xs flex-col space-y-1.5">
          <h1 className="text-center text-2xl font-bold">No stores found</h1>
          <p className="text-center text-muted-foreground">
            Try changing your filters, or check back later for new stores
          </p>
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            href={`/products?store_ids=${store.id}`}
            store={store}
          />
        ))}
      </div>
      {stores.length ? (
        <PaginationButton
          pageCount={pageCount}
          page={page}
          per_page={per_page}
          sort={sort}
          createQueryString={createQueryString}
        />
      ) : null}
    </section>
  )
}
