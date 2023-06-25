"use client"

import * as React from "react"
import type { CartLineItem } from "@/types"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { deleteCartItemAction } from "@/app/_actions/cart"

interface UpdateCartProps {
  cartLineItem: CartLineItem
}

export function UpdateCart({ cartLineItem }: UpdateCartProps) {
  const [isPending, startTransition] = React.useTransition()

  return (
    <div className="flex flex-col gap-1">
      <Button
        aria-label="Remove item"
        variant="destructive"
        size="icon"
        onClick={() => {
          startTransition(async () => {
            await deleteCartItemAction({ productId: cartLineItem.id })
          })
        }}
        disabled={isPending}
      >
        <Icons.trash className="h-3 w-3" aria-hidden="true" />
      </Button>
    </div>
  )
}
