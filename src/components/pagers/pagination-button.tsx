import * as React from "react"
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationButtonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  pageCount: number
  page: string
  per_page?: string
  sort: string
  createQueryString: (params: Record<string, string | number | null>) => string
  router: AppRouterInstance
  pathname: string
  isPending: boolean
  startTransition: React.TransitionStartFunction
  siblingCount?: number
}

export function PaginationButton({
  pageCount,
  page,
  per_page,
  sort,
  createQueryString,
  router,
  pathname,
  isPending,
  startTransition,
  siblingCount = 1,
  className,
  ...props
}: PaginationButtonProps) {
  // Memoize pagination range to avoid unnecessary re-renders
  const paginationRange = React.useMemo(() => {
    const delta = siblingCount + 2

    const range = []
    for (
      let i = Math.max(2, Number(page) - delta);
      i <= Math.min(pageCount - 1, Number(page) + delta);
      i++
    ) {
      range.push(i)
    }

    if (Number(page) - delta > 2) {
      range.unshift("...")
    }
    if (Number(page) + delta < pageCount - 1) {
      range.push("...")
    }

    range.unshift(1)
    if (pageCount !== 1) {
      range.push(pageCount)
    }

    return range
  }, [pageCount, page, siblingCount])

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2",
        className
      )}
      {...props}
    >
      <Button
        aria-label="Go to first page"
        variant="outline"
        size="icon"
        className="hidden h-8 w-8 lg:flex"
        onClick={() => {
          startTransition(() => {
            router.push(
              `${pathname}?${createQueryString({
                page: 1,
                per_page: per_page ?? null,
                sort,
              })}`
            )
          })
        }}
        disabled={Number(page) === 1 || isPending}
      >
        <DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        aria-label="Go to previous page"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          startTransition(() => {
            router.push(
              `${pathname}?${createQueryString({
                page: Number(page) - 1,
                per_page: per_page ?? null,
                sort,
              })}`
            )
          })
        }}
        disabled={Number(page) === 1 || isPending}
      >
        <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
      </Button>
      {paginationRange.map((pageNumber, i) =>
        pageNumber === "..." ? (
          <Button
            aria-label="Page separator"
            key={i}
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled
          >
            ...
          </Button>
        ) : (
          <Button
            aria-label={`Page ${pageNumber}`}
            key={i}
            variant={Number(page) === pageNumber ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              startTransition(() => {
                router.push(
                  `${pathname}?${createQueryString({
                    page: pageNumber,
                    per_page: per_page ?? null,
                    sort,
                  })}`
                )
              })
            }}
            disabled={isPending}
          >
            {pageNumber}
          </Button>
        )
      )}
      <Button
        aria-label="Go to next page"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          startTransition(() => {
            router.push(
              `${pathname}?${createQueryString({
                page: Number(page) + 1,
                per_page: per_page ?? null,
                sort,
              })}`
            )
          })
        }}
        disabled={Number(page) === (pageCount ?? 10) || isPending}
      >
        <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        aria-label="Go to last page"
        variant="outline"
        size="icon"
        className="hidden h-8 w-8 lg:flex"
        onClick={() => {
          router.push(
            `${pathname}?${createQueryString({
              page: pageCount ?? 10,
              per_page: per_page ?? null,
              sort,
            })}`
          )
        }}
        disabled={Number(page) === (pageCount ?? 10) || isPending}
      >
        <DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  )
}
