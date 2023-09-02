"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { type Store } from "@/db/schema"
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"

import { getRandomPatternStyle } from "@/lib/generate-pattern"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface StoreSwitcherProps
  extends React.ComponentPropsWithoutRef<typeof PopoverTrigger> {
  currentStore: Pick<Store, "id" | "name">
  stores: Pick<Store, "id" | "name">[]
  dashboardRedirectPath: string
}

export function StoreSwitcher({
  currentStore,
  stores,
  dashboardRedirectPath,
  className,
  ...props
}: StoreSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            aria-label="Select a store"
            className={cn(
              "w-full justify-between px-3 xxs:w-[180px]",
              className
            )}
            {...props}
          >
            <div
              className="mr-2 aspect-square h-4 w-4 rounded-full"
              style={getRandomPatternStyle(String(currentStore.id))}
            />
            <span className="line-clamp-1">{currentStore.name}</span>
            <CaretSortIcon
              className="ml-auto h-4 w-4 shrink-0 opacity-50"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search store..." />
              <CommandEmpty>No store found.</CommandEmpty>
              <CommandGroup>
                {stores.map((store) => (
                  <CommandItem
                    key={store.id}
                    onSelect={() => {
                      router.push(
                        pathname.replace(
                          String(currentStore.id),
                          String(store.id)
                        )
                      )
                      setIsOpen(false)
                    }}
                    className="text-sm"
                  >
                    <div
                      className="mr-2 aspect-square h-4 w-4 rounded-full"
                      style={getRandomPatternStyle(String(store.id))}
                    />
                    <span className="line-clamp-1">{store.name}</span>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentStore.id === store.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                      aria-hidden="true"
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      router.push(dashboardRedirectPath)
                      setIsOpen(false)
                      setIsDialogOpen(true)
                    }}
                  >
                    <PlusCircledIcon
                      className="mr-2 h-4 w-4"
                      aria-hidden="true"
                    />
                    Create store
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Dialog>
  )
}
