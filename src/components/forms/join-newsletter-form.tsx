"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { emailSchema } from "@/lib/validations/notification"
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

export function JoinNewsletterForm() {
  const [isPending, startTransition] = React.useTransition()

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      const response = await fetch("/api/email/newsletter", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          // This token is used as a search param in the email preferences page to identify the subscriber.
          token: crypto.randomUUID(),
          subject: "Welcome to Skateshop13",
        }),
      })

      if (!response.ok) {
        switch (response.status) {
          case 409:
            toast.error("You are already subscribed to our newsletter.")
            break
          case 422:
            toast.error("Invalid input.")
            break
          case 429:
            toast.error("The daily email limit has been reached.")
            break
          case 500:
            toast.error("Something went wrong. Please try again later.")
            break
          default:
            toast.error("Something went wrong. Please try again later.")
        }
        return
      }

      toast.success("You have been subscribed to our newsletter.")
      form.reset()
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full"
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="relative space-y-0">
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="skate@gmail.com"
                  className="pr-12"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <Button
                className="absolute right-[3.5px] top-[4px] z-20 size-7"
                size="icon"
                disabled={isPending}
              >
                {isPending ? (
                  <Icons.spinner
                    className="size-3 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <PaperPlaneIcon className="size-3" aria-hidden="true" />
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
