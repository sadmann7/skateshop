"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { type Product } from "@/db/schema"
import { CircleIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"

import { productCategories } from "@/config/products"
import { filterProducts } from "@/lib/actions/product"
import { catchError, cn, isMacOs } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductGroup {
  category: Product["category"]
  products: Pick<Product, "id" | "name" | "category">[]
}

export function ProductsCommandMenu() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const debouncedQuery = useDebounce(query, 300)
  const [data, setData] = React.useState<ProductGroup[] | null>(null)
  const [isPending, startTransition] = React.useTransition()

  React.useEffect(() => {
    if (debouncedQuery.length <= 0) {
      setData(null)
      return
    }

    async function fetchData() {
      try {
        const data = await filterProducts(debouncedQuery)
        setData(data)
      } catch (err) {
        catchError(err)
      }
    }

    startTransition(fetchData)

    return () => setData(null)
  }, [debouncedQuery])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSelect = React.useCallback((callback: () => unknown) => {
    setOpen(false)
    callback()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlassIcon className="h-4 w-4 xl:mr-2" aria-hidden="true" />
        <span className="hidden xl:inline-flex">Search products...</span>
        <span className="sr-only">Search products</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 xl:flex">
          <abbr
            title={isMacOs() ? "Command" : "Control"}
            className="no-underline"
          >
            {isMacOs() ? "⌘" : "Ctrl"}
          </abbr>
          K
        </kbd>
      </Button>
      <CommandDialog
        position="top"
        open={open}
        onOpenChange={(open) => {
          setOpen(open)
          if (!open) {
            setQuery("")
          }
        }}
      >
        <CommandInput
          placeholder="Search products..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty
            className={cn(isPending ? "hidden" : "py-6 text-center text-sm")}
          >
            No products found.
          </CommandEmpty>
          {isPending ? (
            <div className="space-y-1 overflow-hidden px-1 py-2">
              <Skeleton className="h-4 w-10 rounded" />
              <Skeleton className="h-8 rounded-sm" />
              <Skeleton className="h-8 rounded-sm" />
            </div>
          ) : (
            data?.map((group) => (
              <CommandGroup
                key={group.category}
                className="capitalize"
                heading={group.category}
              >
                {group.products.map((item) => {
                  const CategoryIcon =
                    productCategories.find(
                      (category) => category.title === group.category
                    )?.icon ?? CircleIcon

                  return (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() =>
                        handleSelect(() => router.push(`/product/${item.id}`))
                      }
                    >
                      <CategoryIcon
                        className="mr-2.5 h-3 w-3 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.name}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
