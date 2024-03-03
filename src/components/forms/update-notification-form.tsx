"use client"

import * as React from "react"
import { type Notification } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"

import { updateNotification } from "@/lib/actions/notification"
import { catchClerkError } from "@/lib/utils"
import { updateNotificationSchema } from "@/lib/validations/notification"
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

interface UpdateNotificationFormProps {
  notification: Notification
}

type Inputs = z.infer<typeof updateNotificationSchema>

export function UpdateNotificationForm({
  notification,
}: UpdateNotificationFormProps) {
  const [isPending, startTransition] = React.useTransition()

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(updateNotificationSchema),
    defaultValues: {
      token: notification.token,
      newsletter: notification.newsletter,
      transactional: notification.transactional,
      marketing: notification.marketing,
    },
  })

  function onSubmit(data: Inputs) {
    console.log(data)
    startTransition(async () => {
      try {
        await updateNotification({
          token: data.token,
          newsletter: data.newsletter,
          transactional: data.transactional,
          marketing: data.marketing,
        })
        toast.success("Email preferences updated.")
      } catch (err) {
        catchClerkError(err)
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="newsletter"
          render={({ field }) => (
            <FormItem className="flex w-full flex-row items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Newsletter</FormLabel>
                <FormDescription>
                  Receive our monthly newsletter with the latest news and
                  updates.
                </FormDescription>
              </div>
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
            <FormItem className="flex w-full flex-row items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Transactional</FormLabel>
                <FormDescription>
                  Receive transactional emails, order confirmations, and more.
                </FormDescription>
              </div>
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
            <FormItem className="flex w-full flex-row items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Marketing</FormLabel>
                <FormDescription>
                  Receive marketing emails, including promotions, discounts, and
                  more.
                </FormDescription>
              </div>
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
        <Button className="w-full" disabled={isPending}>
          {isPending && (
            <Icons.spinner
              className="mr-2 size-4 animate-spin"
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
