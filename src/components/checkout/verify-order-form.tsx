"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import { cn } from "@/lib/utils"
import { verifyOrderSchema } from "@/lib/validations/order"
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

interface VerifyOderFormProps extends React.ComponentPropsWithoutRef<"form"> {}
type Inputs = z.infer<typeof verifyOrderSchema>

export function VerifyOderForm({ className, ...props }: VerifyOderFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(verifyOrderSchema),
    defaultValues: {
      deliveryPostalCode: "",
    },
  })

  function onSubmit(data: Inputs) {
    startTransition(() => {
      console.log(data)
      // Original source: https://github.com/jackblatch/OneStopShop/blob/main/app/(storefront)/checkout/%5BstoreSlug%5D/order-confirmation/components/verification.tsx
      const location = `${
        window.location.href.split("&delivery_postal_code=")[0]
      }&delivery_postal_code=${data.deliveryPostalCode.split(" ").join("")}`
      router.push(location)
    })
  }

  return (
    <Form {...form}>
      <form
        className={cn("grid gap-4", className)}
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        {...props}
      >
        <FormField
          control={form.control}
          name="deliveryPostalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery postal code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Type delivery postal code here."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending}>
          {isPending && (
            <Icons.spinner
              className="mr-2 size-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Verify order
          <span className="sr-only">Verify order</span>
        </Button>
      </form>
    </Form>
  )
}
