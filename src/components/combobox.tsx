"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { GroupedProduct } from "@/types"
import type { Product } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { formatEnum } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { CommandDebouncedInput } from "@/components/ui/debounced"
import { Icons } from "@/components/icons"

interface ComboboxProps {
  buttonText?: string
  placeholder?: string
  empty?: string
}

export function Combobox({
  placeholder = "Search products by name...",
  empty = "No product found.",
}: ComboboxProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const { data, isFetching } = useQuery(
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

  console.log(data)

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
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandDebouncedInput
          placeholder={placeholder}
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>{empty}</CommandEmpty>
          {data?.map((group) => (
            <CommandGroup
              key={group.category}
              heading={formatEnum(group.category)}
            >
              {group.products.map((item) => (
                <CommandItem
                  key={item.id}
                  onClick={() => {
                    router.push(`/products/${group.category}/${item.id}`)
                    setIsOpen(false)
                  }}
                >
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
