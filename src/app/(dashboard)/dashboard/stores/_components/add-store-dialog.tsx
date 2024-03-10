"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type UseFormReturn } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { addStore } from "@/lib/actions/store"
import { type getSubscriptionPlan } from "@/lib/actions/stripe"
import { cn } from "@/lib/utils"
import { addStoreSchema } from "@/lib/validations/store"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

interface AddStoreDialogProps
  extends React.ComponentPropsWithRef<typeof Dialog> {
  userId: string
  subscriptionPlanPromise: ReturnType<typeof getSubscriptionPlan>
}

type Inputs = z.infer<typeof addStoreSchema>

export function AddStoreDialog({
  userId,
  subscriptionPlanPromise,
  ...props
}: AddStoreDialogProps) {
  const subscriptionPlan = React.use(subscriptionPlanPromise)

  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 640px)")

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(addStoreSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  async function onSubmit(data: Inputs) {
    setLoading(true)

    try {
      const { data: store, error } = await addStore({ ...data, userId })

      if (store) {
        router.push(`/dashboard/stores/${store.id}`)
        toast.success("Store created")
        return
      }

      if (error) {
        toast.error(error)
        return
      }
    } finally {
      setLoading(false)
      setOpen(false)
      form.reset()
    }
  }

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            form.reset()
          }
          setOpen(open)
        }}
        {...props}
      >
        <DialogTrigger asChild>
          <Button>Create store</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create a new store</DialogTitle>
            <DialogDescription>
              Create a new store to manage your products
            </DialogDescription>
          </DialogHeader>
          <AddStoreForm form={form} onSubmit={onSubmit}>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && (
                  <Icons.spinner
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Add store
              </Button>
            </DialogFooter>
          </AddStoreForm>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset()
        }
        setOpen(open)
      }}
      {...props}
    >
      <DrawerTrigger asChild>
        <Button>Create store</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create a new store</DrawerTitle>
          <DrawerDescription>
            Create a new store to manage your products
          </DrawerDescription>
        </DrawerHeader>
        <AddStoreForm form={form} onSubmit={onSubmit} className="px-4">
          <DrawerFooter className="flex-col-reverse px-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && (
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Add store
            </Button>
          </DrawerFooter>
        </AddStoreForm>
      </DrawerContent>
    </Drawer>
  )
}

interface AddStoreFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<Inputs>
  onSubmit: (data: Inputs) => void
}

function AddStoreForm({
  children,
  form,
  onSubmit,
  className,
  ...props
}: AddStoreFormProps) {
  return (
    <Form {...form}>
      <form
        className={cn("grid w-full gap-4", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        {...props}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Type store name here." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type store description here."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  )
}
