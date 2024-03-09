import * as React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { env } from "@/env.js"

import { getCacheduser } from "@/lib/actions/auth"
import { getSubscriptionPlan, getSubscriptionPlans } from "@/lib/actions/stripe"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shells/shell"

import { Billing } from "./_components/billing"
import { BillingSkeleton } from "./_components/billing-skeleton"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Billing",
  description: "Manage your billing and subscription",
}

export default async function BillingPage() {
  const user = await getCacheduser()

  if (!user) {
    redirect("/signin")
  }

  const subscriptionPlanPromise = getSubscriptionPlan({ userId: user.id })
  const subscriptionPlansPromise = getSubscriptionPlans()

  return (
    <Shell variant="sidebar" as="div">
      <PageHeader>
        <PageHeaderHeading size="sm">Billing</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your billing and subscription
        </PageHeaderDescription>
      </PageHeader>
      <React.Suspense fallback={<BillingSkeleton />}>
        <Billing
          subscriptionPlanPromise={subscriptionPlanPromise}
          subscriptionPlansPromise={subscriptionPlansPromise}
        />
      </React.Suspense>
    </Shell>
  )
}
