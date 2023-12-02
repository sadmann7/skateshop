"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { type Product } from "@/db/schema"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"

import { getNextProductId, getPreviousProductId } from "@/lib/fetchers/product"
import { Button } from "@/components/ui/button"

interface ProductPagerProps {
  product: Product
}

export function ProductPager({ product }: ProductPagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  return (
    <div className="flex space-x-0.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          startTransition(async () => {
            try {
              const prevProductId = await getPreviousProductId({
                id: product.id,
                storeId: product.storeId,
              })
              router.push(
                `/dashboard/stores/${product.storeId}/products/${prevProductId}`
              )
            } catch (error) {
              error instanceof Error
                ? toast.error(error.message)
                : toast.error("Something went wrong, please try again.")
            }
          })
        }}
        disabled={isPending}
      >
        <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Previous product</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          startTransition(async () => {
            try {
              const nextProductId = await getNextProductId({
                id: product.id,
                storeId: product.storeId,
              })
              router.push(
                `/dashboard/stores/${product.storeId}/products/${nextProductId}`
              )
            } catch (error) {
              error instanceof Error
                ? toast.error(error.message)
                : toast.error("Something went wrong, please try again.")
            }
          })
        }}
        disabled={isPending}
      >
        <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Next product</span>
      </Button>
    </div>
  )
}
