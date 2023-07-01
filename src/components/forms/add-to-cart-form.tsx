"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { updateCartItemSchema } from "@/lib/validations/cart"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { addToCartAction } from "@/app/_actions/cart"

interface AddToCartFromProps {
  productId: number
}

type Inputs = z.infer<typeof updateCartItemSchema>

export function AddToCartForm({ productId }: AddToCartFromProps) {
  const [isPending, startTransition] = React.useTransition()

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(updateCartItemSchema),
    defaultValues: {
      quantity: 1,
    },
  })

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      try {
        await addToCartAction({
          productId,
          quantity: data.quantity,
        })
        toast.success("Added to cart.")
      } catch (error) {
        error instanceof Error
          ? toast.error(error.message)
          : toast.error("Something went wrong, please try again.")
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4 sm:max-w-[240px]"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value
                    const parsedValue = parseInt(value, 10)
                    if (isNaN(parsedValue)) return
                    field.onChange(parsedValue)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending}>
          {isPending && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Add to cart
          <span className="sr-only">Add to cart</span>
        </Button>
      </form>
    </Form>
  )
}
