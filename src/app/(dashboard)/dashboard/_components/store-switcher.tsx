"use client"

import * as React from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
  ShadowIcon,
} from "@radix-ui/react-icons"

import { type getStoresByUserId } from "@/lib/actions/store"
import { type getProgress } from "@/lib/actions/user"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { AddStoreDialog } from "../stores/_components/add-store-dialog"

interface StoreSwitcherProps
  extends React.ComponentPropsWithoutRef<typeof PopoverTrigger> {
  userId: string
  storesPromise: ReturnType<typeof getStoresByUserId>
  progressPromise: ReturnType<typeof getProgress>
}

export function StoreSwitcher({
  userId,
  storesPromise,
  progressPromise,
  className,
  ...props
}: StoreSwitcherProps) {
  const { storeId } = useParams<{ storeId: string }>()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [showNewStoreDialog, setShowNewStoreDialog] = React.useState(false)

  const stores = React.use(storesPromise)
  const progress = React.use(progressPromise)

  const selectedStore = stores.find((store) => store.id === storeId)

  return (
    <>
      <AddStoreDialog
        userId={userId}
        progressPromise={progressPromise}
        open={showNewStoreDialog}
        onOpenChange={setShowNewStoreDialog}
        showTrigger={false}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-full justify-between", className)}
            {...props}
          >
            {selectedStore?.name ?? "Select a store"}
            <CaretSortIcon
              className="ml-auto size-4 shrink-0 opacity-50"
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
                      setOpen(false)
                      pathname.includes(store.id)
                        ? router.replace(pathname.replace(storeId, store.id))
                        : router.push(`/dashboard/stores/${store.id}`)
                    }}
                    className="text-sm"
                  >
                    <ShadowIcon className="mr-2 size-5" aria-hidden="true" />
                    {store.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto size-4",
                        selectedStore?.id === store.id
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
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    setShowNewStoreDialog(true)
                  }}
                  disabled={progress.storeCount >= progress.storeLimit}
                >
                  <PlusCircledIcon className="mr-2 size-5" aria-hidden="true" />
                  Create store
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}
