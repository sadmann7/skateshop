"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

import { addStore } from "@/lib/actions/store"
import { type getUserPlanMetrics } from "@/lib/queries/user"
import { cn } from "@/lib/utils"
import {
  createStoreSchema,
  type CreateStoreSchema,
} from "@/lib/validations/store"
import { useControllableState } from "@/hooks/use-controllable-state"
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

interface CreateStoreDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  userId: string
  planMetricsPromise: ReturnType<typeof getUserPlanMetrics>
  showTrigger?: boolean
}

type PlanMetrics = Awaited<ReturnType<typeof getUserPlanMetrics>>

export function CreateStoreDialog({
  userId,
  planMetricsPromise,
  open: openProp,
  onOpenChange,
  defaultOpen,
  showTrigger = true,
  ...props
}: CreateStoreDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })
  const [loading, setLoading] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 640px)")

  const planMetrics = React.use(planMetricsPromise)

  const form = useForm<CreateStoreSchema>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  async function onSubmit(input: CreateStoreSchema) {
    setLoading(true)

    const { data, error } = await addStore({ ...input, userId })

    if (error) {
      toast.error(error)
      return
    }

    if (data) {
      router.push(`/dashboard/stores/${data.id}`)
      toast.success("Store created")
    }

    setLoading(false)
    setOpen(false)
    form.reset()
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
        <DynamicTrigger
          planMetrics={planMetrics}
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
          <CreateStoreForm form={form} onSubmit={onSubmit}>
            <DialogFooter className="pt-4">
              <FormFooter
                loading={loading}
                planMetrics={planMetrics}
                onToggle={() => setOpen(false)}
              />
            </DialogFooter>
          </CreateStoreForm>
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
        planMetrics={planMetrics}
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
        <CreateStoreForm form={form} onSubmit={onSubmit} className="px-4">
          <DrawerFooter className="flex-col-reverse px-0">
            <FormFooter
              loading={loading}
              planMetrics={planMetrics}
              onToggle={() => setOpen(false)}
            />
          </DrawerFooter>
        </CreateStoreForm>
      </DrawerContent>
    </Drawer>
  )
}

interface CreateStoreFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateStoreSchema>
  onSubmit: (data: CreateStoreSchema) => void
}

function CreateStoreForm({
  children,
  form,
  onSubmit,
  className,
  ...props
}: CreateStoreFormProps) {
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
  planMetrics: PlanMetrics
  onToggle: (open: boolean) => void
}

function FormFooter({ onToggle, loading, planMetrics }: FormFooterProps) {
  const { storeLimitExceeded, productLimitExceeded } = planMetrics

  return (
    <>
      <Button type="button" variant="outline" onClick={() => onToggle(false)}>
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={loading || storeLimitExceeded || productLimitExceeded}
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
  planMetrics: PlanMetrics
  isDesktop: boolean
  showTrigger?: boolean
}

function DynamicTrigger({
  planMetrics,
  showTrigger,
  isDesktop,
}: DynamicTriggerProps) {
  if (!showTrigger) return null

  const {
    storeLimit,
    productLimit,
    storeLimitExceeded,
    productLimitExceeded,
    subscriptionPlan,
  } = planMetrics

  if (storeLimitExceeded || productLimitExceeded) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            size="sm"
            className="cursor-not-allowed opacity-50 hover:bg-primary"
          >
            Create store
          </Button>
        </HoverCardTrigger>
        <HoverCardContent
          className="space-y-4 sm:w-80"
          align="end"
          sideOffset={8}
        >
          {storeLimitExceeded && (
            <div className="text-sm text-muted-foreground">
              You&apos;ve reached the limit of{" "}
              <span className="font-bold">{storeLimit}</span> stores for the{" "}
              <span className="font-bold">{subscriptionPlan?.title}</span> plan.
            </div>
          )}
          {productLimitExceeded && (
            <div className="text-sm text-muted-foreground">
              You&apos;ve reached the limit of{" "}
              <span className="font-bold">{productLimit}</span> products for the{" "}
              <span className="font-bold">{subscriptionPlan?.title}</span> plan.
            </div>
          )}
          {subscriptionPlan && (
            <ManageSubscriptionForm
              stripePriceId={subscriptionPlan.stripePriceId}
              stripeCustomerId={subscriptionPlan.stripeCustomerId}
              stripeSubscriptionId={subscriptionPlan.stripeSubscriptionId}
              isSubscribed={subscriptionPlan.isSubscribed ?? false}
              isCurrentPlan={subscriptionPlan.title === "Standard"}
            />
          )}
        </HoverCardContent>
      </HoverCard>
    )
  }

  if (isDesktop) {
    return (
      <DialogTrigger asChild>
        <Button size="sm">Create store</Button>
      </DialogTrigger>
    )
  }

  return (
    <DrawerTrigger asChild>
      <Button size="sm">Create store</Button>
    </DrawerTrigger>
  )
}
