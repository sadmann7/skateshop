"use client"

import * as React from "react"
import { revalidatePath } from "next/cache"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { checkEmailSchema } from "@/lib/validations/auth"
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
import { joinNewsletterAction } from "@/app/_actions/email"

type Inputs = z.infer<typeof checkEmailSchema>

export function JoinNewsletterForm() {
  const [isPending, startTransition] = React.useTransition()

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(checkEmailSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(data: Inputs) {
    console.log(data)

    startTransition(async () => {
      try {
        // resend doesn't work on in server action in production
        await joinNewsletterAction({
          email: data.email,
        })
        form.reset()
        toast.success("You have successfully joined our newsletter.")

        // const response = await fetch("/api/newsletter", {
        //   method: "POST",
        //   body: JSON.stringify(data),
        // })

        // if (!response.ok) {
        //   toast.error("Something went wrong, please try again.")
        //   return
        // }

        // toast.success("You have successfully joined our newsletter.")
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
                className="absolute right-[5.2px] top-[5.5px] h-7 w-7"
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
