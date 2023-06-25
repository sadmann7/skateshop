"use client"

import * as React from "react"
import type { CartLineItem } from "@/types"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { addToCartAction, deleteCartItemAction } from "@/app/actions/cart"

import { Input } from "../ui/input"

interface UpdateCartProps {
  cartLineItem: CartLineItem
}

export function UpdateCart({ cartLineItem }: UpdateCartProps) {
  const [isPending, startTransition] = React.useTransition()

  return (
    // plus and minus buttons, input field, delete button
    <div className="flex items-center space-x-1">
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            startTransition(async () => {
              await addToCartAction({
                productId: cartLineItem.id,
                quantity: Number(cartLineItem.quantity) - 1,
              })
            })
          }}
          disabled={isPending}
        >
          <Icons.remove className="h-3 w-3" aria-hidden="true" />
          <span className="sr-only">Remove one item</span>
        </Button>
        <Input
          type="number"
          min="0"
          className="h-8 w-14"
          value={cartLineItem.quantity}
          onChange={(e) => {
            startTransition(async () => {
              await addToCartAction({
                productId: cartLineItem.id,
                quantity: Number(e.target.value),
              })
            })
          }}
          disabled={isPending}
        />
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            startTransition(async () => {
              await addToCartAction({
                productId: cartLineItem.id,
                quantity: Number(cartLineItem.quantity) + 1,
              })
            })
          }}
          disabled={isPending}
        >
          <Icons.add className="h-3 w-3" aria-hidden="true" />
          <span className="sr-only">Add one item</span>
        </Button>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          startTransition(async () => {
            await deleteCartItemAction({
              productId: cartLineItem.id,
            })
          })
        }}
        disabled={isPending}
      >
        <Icons.trash className="h-3 w-3" aria-hidden="true" />
        <span className="sr-only">Delete item</span>
      </Button>
    </div>
  )
}
