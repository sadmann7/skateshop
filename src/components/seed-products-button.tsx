"use client"

import * as React from "react"
import { toast } from "sonner"

import { seedProducts } from "@/lib/actions/product"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface SeedProductsProps extends ButtonProps {
  storeId: number
  count?: number
}

export function SeedProducts({
  storeId,
  count,
  className,
  ...props
}: SeedProductsProps) {
  const [isPending, startTransition] = React.useTransition()

  return (
    <Button
      className={cn(className)}
      size="sm"
      onClick={() => {
        startTransition(async () => {
          await seedProducts({
            storeId,
            count,
          })
          toast.success("Products seeded successfully.")
        })
      }}
      {...props}
      disabled={isPending}
    >
      {isPending && <Icons.spinner className="mr-2 size-4 animate-spin" />}
      Seed products
    </Button>
  )
}
