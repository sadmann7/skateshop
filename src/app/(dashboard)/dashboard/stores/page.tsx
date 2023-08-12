import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { products, stores } from "@/db/schema"
import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"
import dayjs from "dayjs"
import { desc, eq, sql } from "drizzle-orm"

import {
  getFeaturedStoreAndProductCounts,
  getUserSubscriptionPlan,
} from "@/lib/subscription"
import { formatDate } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Icons } from "@/components/icons"
import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shells/shell"
import { StoreCard } from "@/components/store-card"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Stores",
  description: "Manage your stores",
}

export default async function StoresPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  const storesWithProductCount = await db
    .select({
      id: stores.id,
      name: stores.name,
      description: stores.description,
      productCount: sql<number>`count(*)`,
    })
    .from(stores)

    .leftJoin(products, eq(products.storeId, stores.id))
    .groupBy(stores.id)
    .orderBy(desc(sql<number>`count(*)`))
    .where(eq(stores.userId, user.id))

  const subscriptionPlan = await getUserSubscriptionPlan(user.id)

  const isSubscriptionPlanActive = dayjs(
    subscriptionPlan.stripeCurrentPeriodEnd
  ).isAfter(dayjs())

  const { featuredStoreCount, featuredProductCount } =
    getFeaturedStoreAndProductCounts(subscriptionPlan.id)

  return (
    <Shell variant="sidebar">
      <PageHeader title="Stores" description="Manage your stores" size="sm" />
      <Alert>
        <Icons.terminal className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You are currently on the{" "}
          <span className="font-semibold">{subscriptionPlan.name}</span> plan.{" "}
          {!subscriptionPlan.isSubscribed
            ? "Upgrade to create more stores and products."
            : subscriptionPlan.isCanceled
            ? "Your plan will be canceled on "
            : "Your plan renews on "}
          {subscriptionPlan?.stripeCurrentPeriodEnd
            ? `${formatDate(subscriptionPlan.stripeCurrentPeriodEnd)}.`
            : null}{" "}
          You can create up to{" "}
          <span className="font-semibold">{featuredStoreCount}</span> stores and{" "}
          <span className="font-semibold">{featuredProductCount}</span> products
          on this plan.
        </AlertDescription>
      </Alert>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {storesWithProductCount.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            route={`/dashboard/stores/${store.id}`}
            buttonText="Manage store"
          />
        ))}
        {storesWithProductCount.length < 3 && (
          <StoreCard
            cardTitle="Create a new store"
            cardDescription="Create a new store to start selling your products."
            route={
              subscriptionPlan.id === "basic" &&
              storesWithProductCount.length >= 1
                ? "/dashboard/billing"
                : subscriptionPlan.id === "standard" &&
                  isSubscriptionPlanActive &&
                  storesWithProductCount.length >= 2
                ? "/dashboard/billing"
                : subscriptionPlan.id === "pro" &&
                  isSubscriptionPlanActive &&
                  storesWithProductCount.length >= 3
                ? "/dashboard/billing"
                : "/dashboard/stores/new"
            }
            buttonText="Create store"
          />
        )}
      </div>
    </Shell>
  )
}
