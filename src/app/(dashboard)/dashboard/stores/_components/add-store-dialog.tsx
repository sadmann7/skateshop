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
import { UsageCard } from "@/components/cards/usage-card"
import { Icons } from "@/components/icons"
import { ManageSubscriptionForm } from "@/components/manage-subscription-form"

interface AddStoreDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  userId: string
  progressPromise: ReturnType<typeof getProgress>
  showTrigger?: boolean
}

type Progress = Awaited<ReturnType<typeof getProgress>>

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

  function onToggle(open: boolean) {
    setOpen(open)
    onOpenChange?.(open)
  }

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
      onToggle(false)
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
          onToggle(open)
        }}
        {...props}
      >
        <DynamicTrigger
          progress={progress}
          isDesktop={isDesktop}
          showTrigger={showTrigger}
        />
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create a new store</DialogTitle>
            <DialogDescription>
              Create a new store to manage your products
            </DialogDescription>
          </DialogHeader>
          <AddStoreForm form={form} onSubmit={onSubmit}>
            <DialogFooter className="pt-4">
              <FormFooter
                loading={loading}
                progress={progress}
                onToggle={onToggle}
              />
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
        progress={progress}
        isDesktop={isDesktop}
        showTrigger={showTrigger}
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
            <FormFooter
              loading={loading}
              progress={progress}
              onToggle={onToggle}
            />
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
  progress: Progress
  onToggle: (open: boolean) => void
}

function FormFooter({ onToggle, loading, progress }: FormFooterProps) {
  return (
    <>
      <Button type="button" variant="outline" onClick={() => onToggle(false)}>
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={
          loading ||
          progress.storeCount >= progress.storeLimit ||
          progress.productCount >= progress.productLimit
        }
      >
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
  progress: Progress
  isDesktop: boolean
  showTrigger?: boolean
}

function DynamicTrigger({
  progress,
  showTrigger,
  isDesktop,
}: DynamicTriggerProps) {
  if (!showTrigger) return null

  const {
    storeLimit,
    storeCount,
    productLimit,
    productCount,
    subscriptionPlan,
  } = progress

  const storeLimitReached = storeCount >= storeLimit
  const productLimitReached = productCount >= productLimit

  if (storeLimitReached || productLimitReached) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button className="cursor-not-allowed opacity-50 hover:bg-primary">
            Create store
          </Button>
        </HoverCardTrigger>
        <HoverCardContent
          className="space-y-4 sm:w-80"
          align="end"
          sideOffset={8}
        >
          {storeLimitReached ? (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                You&apos;ve reached the limit of{" "}
                <span className="font-bold">{storeLimit}</span> stores for the{" "}
                <span className="font-bold">{subscriptionPlan?.title}</span>{" "}
                plan.
              </div>
              <UsageCard title="Stores" count={storeCount} limit={storeLimit} />
            </div>
          ) : null}
          {productLimitReached ? (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                You&apos;ve reached the limit of{" "}
                <span className="font-bold">{productLimit}</span> products for
                the <span className="font-bold">{subscriptionPlan?.title}</span>{" "}
                plan.
              </div>
              <UsageCard
                title="Products"
                count={productCount}
                limit={productLimit}
              />
            </div>
          ) : null}
          {subscriptionPlan ? (
            <ManageSubscriptionForm
              stripePriceId={subscriptionPlan.stripePriceId}
              stripeCustomerId={subscriptionPlan.stripeCustomerId}
              stripeSubscriptionId={subscriptionPlan.stripeSubscriptionId}
              isSubscribed={subscriptionPlan.isSubscribed ?? false}
              isCurrentPlan={subscriptionPlan.title === "Standard"}
            />
          ) : null}
        </HoverCardContent>
      </HoverCard>
    )
  }

  if (isDesktop) {
    return (
      <DialogTrigger asChild>
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
