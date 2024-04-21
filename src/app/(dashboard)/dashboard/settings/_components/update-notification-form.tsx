"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { updateNotification } from "@/lib/actions/notification"
import { type getNotification } from "@/lib/queries/notification"
import {
  updateNotificationSchema,
  type UpdateNotificationSchema,
} from "@/lib/validations/notification"
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
  notificationPromise: ReturnType<typeof getNotification>
}

export function UpdateNotificationForm({
  notificationPromise,
}: UpdateNotificationFormProps) {
  const notification = React.use(notificationPromise)
  const [loading, setLoading] = React.useState(false)

  const form = useForm<UpdateNotificationSchema>({
    resolver: zodResolver(updateNotificationSchema),
    defaultValues: {
      token: notification?.token,
      newsletter: notification?.newsletter,
      marketing: notification?.marketing,
    },
  })

  async function onSubmit(input: UpdateNotificationSchema) {
    setLoading(true)
    const { error } = await updateNotification({
      token: input.token,
      newsletter: input.newsletter,
      communication: input.communication,
      marketing: input.marketing,
    })

    if (error) {
      toast.error(error)
      return
    }

    toast.success("Preferences updated")
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="communication"
          render={({ field }) => (
            <FormItem className="flex w-full items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Communication emails
                </FormLabel>
                <FormDescription>
                  Receive transactional emails, such as order confirmations and
                  shipping updates.
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
          name="newsletter"
          render={({ field }) => (
            <FormItem className="flex w-full flex-row items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Newsletter emails</FormLabel>
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
          name="marketing"
          render={({ field }) => (
            <FormItem className="flex w-full flex-row items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Marketing emails</FormLabel>
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
        <Button size="sm" className="w-fit" disabled={loading}>
          {loading && (
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
