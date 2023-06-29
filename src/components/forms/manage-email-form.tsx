"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"

import { manageEmailSchema } from "@/lib/validations/email"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Icons } from "@/components/icons"
import { manageEmailAction } from "@/app/_actions/email"

interface ManageEmailFormProps {
  email: string
  token: string
}

type Inputs = z.infer<typeof manageEmailSchema>

export function ManageEmailForm({ email, token }: ManageEmailFormProps) {
  const [isPending, startTransition] = React.useTransition()

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(manageEmailSchema),
    defaultValues: {
      email: "",
      token: "",
      newsletter: false,
      transactional: false,
      marketing: false,
    },
  })

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      try {
        await manageEmailAction({
          ...data,
          email,
          token,
        })
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
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="newsletter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Newsletter</FormLabel>
              <FormDescription>
                Receive our monthly newsletter with the latest news and updates.
              </FormDescription>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="transactional"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transactional</FormLabel>
              <FormDescription>
                Receive transactional emails, order confirmations, and more.
              </FormDescription>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="marketing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marketing</FormLabel>
              <FormDescription>
                Receive marketing emails, including promotions, discounts, and
                more.
              </FormDescription>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
          Save preferences
          <span className="sr-only">Save preferences</span>
        </Button>
      </form>
    </Form>
  )
}
