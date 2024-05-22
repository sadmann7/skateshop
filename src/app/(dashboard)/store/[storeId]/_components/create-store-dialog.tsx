"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { HoverCardPortal } from "@radix-ui/react-hover-card"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { createStore } from "@/lib/actions/store"
import { type getUserPlanMetrics } from "@/lib/queries/user"
import {
  createStoreSchema,
  type CreateStoreSchema,
} from "@/lib/validations/store"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Icons } from "@/components/icons"
import { RateLimitAlert } from "@/components/rate-limit-alert"

import { CreateStoreForm } from "./create-store-form"

interface CreateStoreDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  userId: string
  planMetricsPromise: ReturnType<typeof getUserPlanMetrics>
}

export function CreateStoreDialog({
  userId,
  planMetricsPromise,
  onOpenChange,
  ...props
}: CreateStoreDialogProps) {
  const router = useRouter()
  const [isCreatePending, startCreateTransaction] = React.useTransition()
  const isDesktop = useMediaQuery("(min-width: 640px)")

  const planMetrics = React.use(planMetricsPromise)
  const rateLimitExceeded =
    planMetrics.storeLimitExceeded || planMetrics.productLimitExceeded

  const form = useForm<CreateStoreSchema>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  function onSubmit(input: CreateStoreSchema) {
    startCreateTransaction(async () => {
      const { data, error } = await createStore({ ...input, userId })

      if (error) {
        toast.error(error)
        return
      }

      if (data) {
        router.push(`/dashboard/stores/${data.id}`)
        toast.success("Store created")
      }

      onOpenChange?.(false)
      form.reset()
    })
  }

  if (isDesktop) {
    return (
      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            form.reset()
          }
          onOpenChange?.(open)
        }}
        {...props}
      >
        {
          /**
           * If onOpenChange is provided, the drawer is controlled by the parent component.
           * In this case, we don't show the trigger button.
           */
          !!onOpenChange ? null : rateLimitExceeded ? (
            <RateLimitHoverCard planMetrics={planMetrics} />
          ) : (
            <DialogTrigger asChild>
              <Button size="sm">Create store</Button>
            </DialogTrigger>
          )
        }
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create a new store</DialogTitle>
            <DialogDescription>
              Create a new store to manage your products
            </DialogDescription>
          </DialogHeader>
          <CreateStoreForm form={form} onSubmit={onSubmit}>
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isCreatePending || rateLimitExceeded}
              >
                {isCreatePending && (
                  <Icons.spinner
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Add store
              </Button>
            </DialogFooter>
          </CreateStoreForm>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer
      onOpenChange={(open) => {
        if (!open) {
          form.reset()
        }
        onOpenChange?.(open)
      }}
      {...props}
    >
      {!!onOpenChange ? null : rateLimitExceeded ? (
        <RateLimitHoverCard planMetrics={planMetrics} />
      ) : (
        <DrawerTrigger asChild>
          <Button size="sm">Create store</Button>
        </DrawerTrigger>
      )}
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create a new store</DrawerTitle>
          <DrawerDescription>
            Create a new store to manage your products
          </DrawerDescription>
        </DrawerHeader>
        <CreateStoreForm form={form} onSubmit={onSubmit} className="px-4">
          <DrawerFooter className="flex-col-reverse px-0">
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
            <Button
              type="submit"
              disabled={isCreatePending || rateLimitExceeded}
            >
              {isCreatePending && (
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Add store
            </Button>
          </DrawerFooter>
        </CreateStoreForm>
      </DrawerContent>
    </Drawer>
  )
}

interface RateLimitHoverCardProps {
  planMetrics: Awaited<ReturnType<typeof getUserPlanMetrics>>
}

export function RateLimitHoverCard({ planMetrics }: RateLimitHoverCardProps) {
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
      <HoverCardPortal>
        <HoverCardContent
          className="z-50 space-y-4 sm:w-80"
          align="end"
          sideOffset={8}
        >
          <RateLimitAlert planMetrics={planMetrics} />
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  )
}
