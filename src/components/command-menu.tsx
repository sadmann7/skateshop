"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { GroupedProduct } from "@/types"
import type { Product } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { CommandEmpty } from "cmdk"

import { cn, formatEnum } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  CommandDialogFixed,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { CommandDebouncedInput } from "@/components/ui/debounced"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

interface CommandMenuProps {
  placeholder?: string
  empty?: string
}

export function CommandMenu({
  placeholder = "Search products by name...",
  empty = "No product found.",
}: CommandMenuProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const { data, isFetching, isSuccess } = useQuery(
    ["filterProducts", query],
    async () => {
      const response = await fetch("/api/products/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      })
      const data = (await response.json()) as GroupedProduct<
        Pick<Product, "id" | "name">
      >[]
      return data
    },
    {
      enabled: query.length > 0,
      refetchOnWindowFocus: false,
    }
  )

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((isOpen) => !isOpen)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSelect = React.useCallback((callback: () => unknown) => {
    setIsOpen(false)
    callback()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative justify-start sm:w-44 lg:w-56"
        onClick={() => setIsOpen(true)}
      >
        <Icons.search className="mr-2 h-4 w-4" aria-hidden="true" />
        <span className="hidden lg:inline-flex">Search products...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <span className="sr-only">Search products</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </Button>
      <CommandDialogFixed open={isOpen} onOpenChange={setIsOpen}>
        <CommandDebouncedInput
          placeholder={placeholder}
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty
            className={cn("py-6 text-center text-sm", isFetching && "hidden")}
          >
            {empty}
          </CommandEmpty>
          {isFetching ? (
            <div className="space-y-1 overflow-hidden px-1 py-2">
              <Skeleton className="h-4 w-10 rounded" />
              <Skeleton className="h-8 rounded-sm" />
              <Skeleton className="h-8 rounded-sm" />
              <Skeleton className="h-8 rounded-sm" />
            </div>
          ) : (
            isSuccess &&
            data.map((group) => (
              <CommandGroup
                key={group.category}
                heading={formatEnum(group.category)}
              >
                {group.products.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() =>
                      handleSelect(() =>
                        router.push(`/products/${group.category}/${item.id}`)
                      )
                    }
                  >
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))
          )}
        </CommandList>
      </CommandDialogFixed>
    </>
  )
}
