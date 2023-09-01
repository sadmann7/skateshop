import { notFound, redirect } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import {
  getDashboardRedirectPath,
  getUserSubscriptionPlan,
} from "@/lib/subscription"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { StoreSwitcher } from "@/components/pagers/store-switcher"
import { StoreTabs } from "@/components/pagers/store-tabs"
import { Shell } from "@/components/shells/shell"

interface StoreLayoutProps {
  children: React.ReactNode
  params: {
    storeId: string
  }
}

export default async function StoreLayout({
  children,
  params,
}: StoreLayoutProps) {
  const storeId = Number(params.storeId)

  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  const allStores = await db
    .select({
      id: stores.id,
      name: stores.name,
    })
    .from(stores)
    .where(eq(stores.userId, user.id))

  const store = allStores.find((store) => store.id === storeId)

  if (!store) {
    notFound()
  }

  const subscriptionPlan = await getUserSubscriptionPlan(user.id)

  return (
    <Shell variant="sidebar">
      <div className="flex flex-col gap-4 pr-1 xxs:flex-row">
        <PageHeader className="flex-1">
          <PageHeaderHeading size="sm">Dashboard</PageHeaderHeading>
          <PageHeaderDescription size="sm">
            Manage your store
          </PageHeaderDescription>
        </PageHeader>
        {allStores.length > 1 ? (
          <StoreSwitcher
            currentStore={store}
            stores={allStores}
            dashboardRedirectPath={getDashboardRedirectPath({
              subscriptionPlan,
              storeCount: allStores.length,
            })}
          />
        ) : null}
      </div>
      <div className="space-y-8 overflow-auto">
        <StoreTabs storeId={storeId} />
        {children}
      </div>
    </Shell>
  )
}
