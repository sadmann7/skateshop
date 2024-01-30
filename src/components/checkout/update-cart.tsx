"use client"

import * as React from "react"
import type { CartLineItem } from "@/types"
import { MinusIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons"

import { deleteCartItem, updateCartItem } from "@/lib/actions/cart"
import { catchError } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface UpdateCartProps {
  cartLineItem: CartLineItem
}

export function UpdateCart({ cartLineItem }: UpdateCartProps) {
  const id = React.useId()
  const [isPending, startTransition] = React.useTransition()

  return (
    <div className="flex w-full items-center justify-between space-x-2 xs:w-auto xs:justify-normal">
      <div className="flex items-center">
        <Button
          id={`${id}-decrement`}
          variant="outline"
          size="icon"
          className="size-8 rounded-r-none"
          onClick={() => {
            startTransition(async () => {
              try {
                await updateCartItem({
                  productId: cartLineItem.id,
                  quantity: Number(cartLineItem.quantity) - 1,
                })
              } catch (err) {
                catchError(err)
              }
            })
          }}
          disabled={isPending}
        >
          <MinusIcon className="size-3" aria-hidden="true" />
          <span className="sr-only">Remove one item</span>
        </Button>
        <Input
          id={`${id}-quantity`}
          type="number"
          min="0"
          className="h-8 w-14 rounded-none border-x-0"
          value={cartLineItem.quantity}
          onChange={(e) => {
            startTransition(async () => {
              try {
                await updateCartItem({
                  productId: cartLineItem.id,
                  quantity: Number(e.target.value),
                })
              } catch (err) {
                catchError(err)
              }
            })
          }}
          disabled={isPending}
        />
        <Button
          id={`${id}-increment`}
          variant="outline"
          size="icon"
          className="size-8 rounded-l-none"
          onClick={() => {
            startTransition(async () => {
              try {
                await updateCartItem({
                  productId: cartLineItem.id,
                  quantity: Number(cartLineItem.quantity) + 1,
                })
              } catch (err) {
                catchError(err)
              }
            })
          }}
          disabled={isPending}
        >
          <PlusIcon className="size-3" aria-hidden="true" />
          <span className="sr-only">Add one item</span>
        </Button>
      </div>
      <Button
        id={`${id}-delete`}
        variant="outline"
        size="icon"
        className="size-8"
        onClick={() => {
          startTransition(async () => {
            try {
              await deleteCartItem({
                productId: cartLineItem.id,
              })
            } catch (err) {
              catchError(err)
            }
          })
        }}
        disabled={isPending}
      >
        <TrashIcon className="size-3" aria-hidden="true" />
        <span className="sr-only">Delete item</span>
      </Button>
    </div>
  )
}
