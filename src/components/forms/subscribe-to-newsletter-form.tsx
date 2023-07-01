"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { emailSchema } from "@/lib/validations/email"
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

type Inputs = z.infer<typeof emailSchema>

export function SubscribeToNewsletterForm() {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(data: Inputs) {
    console.log(data)
 
    startTransition(async () => {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          // This token is used as a search param in the email preferences page to identify the subscriber.
          token: crypto.randomUUID(),
          subject: "Welcome to Skateshop13",
        }),
      })

      if (response.status === 409) {
        toast.error("You are already subscribed to our newsletter.")
      }

      if (response.status === 422) {
        toast.error("Inavlid input.")
      }

      if (response.status === 429) {
        toast.error("The daily email limit has been reached.")
      }

      if (response.status === 500) {
        toast.error("Something went wrong. Please try again later.")
      }

      if (response.ok) {
        toast.success("You have successfully joined our newsletter.")
        form.reset()
        router.refresh()
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-xs gap-5"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="rodneymullen180@gmail.com"
                  className="pr-12"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <Button
                className="absolute right-[5.2px] top-[5.5px] z-20 h-7 w-7"
                size="icon"
                disabled={isPending}
              >
                {isPending ? (
                  <Icons.spinner
                    className="h-3 w-3 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Icons.send className="h-3 w-3" aria-hidden="true" />
                )}
                <span className="sr-only">Join newsletter</span>
              </Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
