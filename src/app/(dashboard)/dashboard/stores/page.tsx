import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { env } from "@/env.js"
import { RocketIcon } from "@radix-ui/react-icons"

import { getCacheduser } from "@/lib/actions/auth"
import { getUserStores } from "@/lib/actions/store"
import { getSubscriptionPlan } from "@/lib/actions/stripe"
import { getDashboardRedirectPath, getPlanFeatures } from "@/lib/subscription"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { buttonVariants } from "@/components/ui/button"
import { StoreCard } from "@/components/cards/store-card"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shells/shell"
import { StoreCardSkeleton } from "@/components/skeletons/store-card-skeleton"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Stores",
  description: "Manage your stores",
}

export default async function StoresPage() {
  const user = await getCacheduser()

  if (!user) {
    redirect("/signin")
  }

  const userStoresPromise = getUserStores({ userId: user.id })

  const subscriptionPlanPromise = getSubscriptionPlan({ userId: user.id })

  const [allStores, subscriptionPlan] = await Promise.all([
    userStoresPromise,
    subscriptionPlanPromise,
  ])

  const { maxStoreCount, maxProductCount } = getPlanFeatures(
    subscriptionPlan?.title ?? "free"
  )

  return (
    <Shell variant="sidebar">
      <PageHeader>
        <div className="flex space-x-4">
          <PageHeaderHeading size="sm" className="flex-1">
            Stores
          </PageHeaderHeading>
          <Link
            aria-label="Create store"
            href={getDashboardRedirectPath({
              storeCount: allStores.length,
              subscriptionPlan: subscriptionPlan,
            })}
            className={cn(
              buttonVariants({
                size: "sm",
              })
            )}
          >
            Create store
          </Link>
        </div>
        <PageHeaderDescription size="sm">
          Manage your stores
        </PageHeaderDescription>
      </PageHeader>
      <Alert>
        <RocketIcon className="size-4" aria-hidden="true" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You are currently on the{" "}
          <span className="font-semibold">{subscriptionPlan?.title}</span> plan.
          You can create up to{" "}
          <span className="font-semibold">{maxStoreCount}</span> stores and{" "}
          <span className="font-semibold">{maxProductCount}</span> products on
          this plan.
        </AlertDescription>
      </Alert>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <React.Suspense
          fallback={Array.from({ length: 3 }).map((_, i) => (
            <StoreCardSkeleton key={i} />
          ))}
        >
          {allStores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              href={`/dashboard/stores/${store.id}`}
            />
          ))}
        </React.Suspense>
      </section>
    </Shell>
  )
}
