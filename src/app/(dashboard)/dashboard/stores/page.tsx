import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { products, stores } from "@/db/schema"
import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"
import { RocketIcon } from "@radix-ui/react-icons"
import { desc, eq, sql } from "drizzle-orm"

import {
  getDashboardRedirectPath,
  getPlanFeatures,
  getUserSubscriptionPlan,
} from "@/lib/subscription"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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

  const { maxStoreCount, maxProductCount } = getPlanFeatures(
    subscriptionPlan?.id
  )

  return (
    <Shell variant="sidebar">
      <PageHeader title="Stores" description="Manage your stores" size="sm" />
      <Alert>
        <RocketIcon className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You are currently on the{" "}
          <span className="font-semibold">{subscriptionPlan?.name}</span> plan.{" "}
          You can create up to{" "}
          <span className="font-semibold">{maxStoreCount}</span> stores and{" "}
          <span className="font-semibold">{maxProductCount}</span> products on
          this plan.
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
            route={getDashboardRedirectPath({
              storeCount: storesWithProductCount.length,
              subscriptionPlan: subscriptionPlan,
            })}
            buttonText="Create store"
          />
        )}
      </div>
    </Shell>
  )
}
