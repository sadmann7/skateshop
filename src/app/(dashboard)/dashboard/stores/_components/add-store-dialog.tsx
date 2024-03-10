"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type UseFormReturn } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { addStore } from "@/lib/actions/store"
import { type getProgress } from "@/lib/actions/user"
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { ManageSubscriptionForm } from "@/components/manage-subscription-form"

interface AddStoreDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  userId: string
  progressPromise: ReturnType<typeof getProgress>
  showTrigger?: boolean
}

type Inputs = z.infer<typeof addStoreSchema>

export function AddStoreDialog({
  userId,
  progressPromise,
  onOpenChange,
  showTrigger = true,
  ...props
}: AddStoreDialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 640px)")

  const progress = React.use(progressPromise)

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
          onOpenChange?.(open)
        }}
        {...props}
      >
        <DynamicTrigger
          showTrigger={showTrigger}
          isDesktop={isDesktop}
          progress={progress}
        />
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create a new store</DialogTitle>
            <DialogDescription>
              Create a new store to manage your products
            </DialogDescription>
          </DialogHeader>
          <AddStoreForm form={form} onSubmit={onSubmit}>
            <DialogFooter>
              <FormFooter loading={loading} setOpen={setOpen} />
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
        onOpenChange?.(open)
      }}
      {...props}
    >
      <DynamicTrigger
        showTrigger={showTrigger}
        isDesktop={isDesktop}
        progress={progress}
      />
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create a new store</DrawerTitle>
          <DrawerDescription>
            Create a new store to manage your products
          </DrawerDescription>
        </DrawerHeader>
        <AddStoreForm form={form} onSubmit={onSubmit} className="px-4">
          <DrawerFooter className="flex-col-reverse px-0">
            <FormFooter loading={loading} setOpen={setOpen} />
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

interface FormFooterProps {
  loading: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function FormFooter({ loading, setOpen }: FormFooterProps) {
  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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
    </>
  )
}

interface DynamicTriggerProps {
  isDesktop: boolean
  showTrigger?: boolean
  progress: Awaited<ReturnType<typeof getProgress>>
}

function DynamicTrigger({
  showTrigger,
  isDesktop,
  progress,
}: DynamicTriggerProps) {
  if (!showTrigger) return null

  const {
    storeLimit,
    storeProgress,
    productLimit,
    productProgress,
    subscriptionPlan,
  } = progress

  const limtReached = storeProgress === 100 || productProgress === 100

  if (limtReached) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button className="cursor-not-allowed opacity-50 hover:bg-primary">
            Create store
          </Button>
        </HoverCardTrigger>
        <HoverCardContent
          className="w-80 space-y-2.5"
          align="end"
          sideOffset={8}
        >
          {storeProgress === 100 ? (
            <div className="text-sm text-muted-foreground">
              You can only create upto{" "}
              <span className="font-bold">{storeLimit}</span> stores in your
              current plan.
            </div>
          ) : productProgress === 100 ? (
            <div className="text-sm text-muted-foreground">
              You can only create upto{" "}
              <span className="font-bold">{productLimit}</span> products in your
              current plan.
            </div>
          ) : null}
          {subscriptionPlan && subscriptionPlan.title !== "pro" ? (
            <ManageSubscriptionForm
              stripePriceId={subscriptionPlan.stripePriceId}
              stripeCustomerId={subscriptionPlan.stripeCustomerId}
              stripeSubscriptionId={subscriptionPlan.stripeSubscriptionId}
              isSubscribed={subscriptionPlan.isSubscribed ?? false}
              isCurrentPlan={subscriptionPlan.title === "standard"}
            />
          ) : null}
        </HoverCardContent>
      </HoverCard>
    )
  }

  if (isDesktop) {
    return (
      <DialogTrigger>
        <Button>Create store</Button>
      </DialogTrigger>
    )
  }

  return (
    <DrawerTrigger asChild>
      <Button>Create store</Button>
    </DrawerTrigger>
  )
}
