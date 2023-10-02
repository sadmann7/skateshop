"use client"

import * as React from "react"
import type { CartLineItem } from "@/types"
import { MinusIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons"

import { catchError } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { deleteCartItemAction, updateCartItemAction } from "@/app/_actions/cart"

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
          className="h-8 w-8 rounded-r-none"
          onClick={() => {
            startTransition(async () => {
              try {
                await updateCartItemAction({
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
          <MinusIcon className="h-3 w-3" aria-hidden="true" />
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
                await updateCartItemAction({
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
          className="h-8 w-8 rounded-l-none"
          onClick={() => {
            startTransition(async () => {
              try {
                await updateCartItemAction({
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
          <PlusIcon className="h-3 w-3" aria-hidden="true" />
          <span className="sr-only">Add one item</span>
        </Button>
      </div>
      <Button
        id={`${id}-delete`}
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          startTransition(async () => {
            try {
              await deleteCartItemAction({
                productId: cartLineItem.id,
              })
            } catch (err) {
              catchError(err)
            }
          })
        }}
        disabled={isPending}
      >
        <TrashIcon className="h-3 w-3" aria-hidden="true" />
        <span className="sr-only">Delete item</span>
      </Button>
    </div>
  )
}
