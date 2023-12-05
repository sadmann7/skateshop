"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { joinNewsletter } from "@/lib/actions/email"
import { catchError } from "@/lib/utils"
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
    console.log(data)

    startTransition(async () => {
      try {
        await joinNewsletter({
          email: data.email,
          token: crypto.randomUUID(),
          subject: "Welcome to Skateshop",
        })

        toast.success("You have been subscribed to our newsletter.")
        form.reset()
      } catch (err) {
        catchError(err)
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
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
                className="absolute right-[3.5px] top-[4px] z-20 h-7 w-7"
                size="icon"
                disabled={isPending}
              >
                {isPending ? (
                  <Icons.spinner
                    className="h-3 w-3 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <PaperPlaneIcon className="h-3 w-3" aria-hidden="true" />
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
