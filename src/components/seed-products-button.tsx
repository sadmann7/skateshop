"use client"

import * as React from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { seedProducts } from "@/app/_actions/product"

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
      {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      Seed products
    </Button>
  )
}
