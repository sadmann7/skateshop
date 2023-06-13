"use client"

import * as React from "react"
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface PaginationButtonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  pageCount: number
  page: string
  per_page?: string
  sort: string
  order: string
  createQueryString: (params: Record<string, string | number | null>) => string
  router: AppRouterInstance
  pathname: string
  isPending: boolean
  startTransition: React.TransitionStartFunction
}

export function PaginationButton({
  pageCount,
  page,
  per_page,
  sort,
  order,
  createQueryString,
  router,
  pathname,
  isPending,
  startTransition,
  className,
  ...props
}: PaginationButtonProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)} {...props}>
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 px-0"
        onClick={() => {
          startTransition(() => {
            router.push(
              `${pathname}?${createQueryString({
                page: 1,
                per_page: per_page ?? null,
                sort,
                order,
              })}`
            )
          })
        }}
        disabled={Number(page) === 1 || isPending}
      >
        <Icons.chevronsLeft className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">First page</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 px-0"
        onClick={() => {
          startTransition(() => {
            router.push(
              `${pathname}?${createQueryString({
                page: Number(page) - 1,
                per_page: per_page ?? null,
                sort,
                order,
              })}`
            )
          })
        }}
        disabled={Number(page) === 1 || isPending}
      >
        <Icons.chevronLeft className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Previous page</span>
      </Button>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <Button
          key={p}
          variant={Number(page) === p ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 px-0"
          onClick={() => {
            startTransition(() => {
              router.push(
                `${pathname}?${createQueryString({
                  page: p,
                  per_page: per_page ?? null,
                  sort,
                  order,
                })}`
              )
            })
          }}
          disabled={isPending}
        >
          {p}
          <span className="sr-only">{p === Number(page) ? "Current" : ""}</span>
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 px-0"
        onClick={() => {
          startTransition(() => {
            router.push(
              `${pathname}?${createQueryString({
                page: Number(page) + 1,
                per_page: per_page ?? null,
                sort,
                order,
              })}`
            )
          })
        }}
        disabled={Number(page) === (pageCount ?? 10) || isPending}
      >
        <Icons.chevronRight className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Next page</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 px-0"
        onClick={() => {
          router.push(
            `${pathname}?${createQueryString({
              page: pageCount ?? 10,
              per_page: per_page ?? null,
              sort,
              order,
            })}`
          )
        }}
        disabled={Number(page) === (pageCount ?? 10) || isPending}
      >
        <Icons.chevronsRight className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Last page</span>
      </Button>
    </div>
  )
}
