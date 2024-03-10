"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { type Store } from "@/db/schema"
import type { UserSubscriptionPlan } from "@/types"
import {
  CaretSortIcon,
  CheckIcon,
  CircleIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"

import type { getStoresByUserId } from "@/lib/actions/store"
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
  currentStore?: Awaited<ReturnType<typeof getStoresByUserId>>[number]
  stores: Pick<Store, "id" | "name">[]
  subscriptionPlan: UserSubscriptionPlan | null
}

export function StoreSwitcher({
  currentStore,
  stores,
  subscriptionPlan,
  className,
  ...props
}: StoreSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [showStoreDialog, setShowStoreDialog] = React.useState(false)

  return (
    <Dialog open={showStoreDialog} onOpenChange={setShowStoreDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between px-3", className)}
            {...props}
          >
            <CircleIcon className="mr-2 size-4" aria-hidden="true" />
            <span className="line-clamp-1">
              {currentStore?.name ? currentStore?.name : "Select a store"}
            </span>
            <CaretSortIcon
              className="ml-auto size-4 shrink-0 opacity-50"
              aria-hidden="true"
            />
            <span className="sr-only">Select a store</span>
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
                          String(currentStore?.id),
                          String(store.id)
                        )
                      )
                      setOpen(false)
                    }}
                    className="text-sm"
                  >
                    <CircleIcon className="mr-2 size-4" aria-hidden="true" />
                    <span className="line-clamp-1">{store.name}</span>
                    <CheckIcon
                      className={cn(
                        "ml-auto size-4",
                        currentStore?.id === store.id
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
                      setOpen(false)
                      setShowStoreDialog(true)
                    }}
                  >
                    <PlusCircledIcon
                      className="mr-2 size-4"
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
