import Link from "next/link"
import type { PlanWithPrice, UserPlan } from "@/types"
import { CheckIcon } from "@radix-ui/react-icons"

import { type getUserUsageMetrics } from "@/lib/queries/user"
import { getPlanLimits } from "@/lib/subscription"
import { cn, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ManagePlanForm } from "@/components/manage-plan-form"
import { UsageCard } from "@/components/usage-card"

interface BillingProps {
  planPromise: Promise<UserPlan | null>
  plansPromise: Promise<PlanWithPrice[]>
  usageMetricsPromise: ReturnType<typeof getUserUsageMetrics>
}

export async function Billing({
  planPromise,
  plansPromise,
  usageMetricsPromise,
}: BillingProps) {
  const [plan, plans, usageMetrics] = await Promise.all([
    planPromise,
    plansPromise,
    usageMetricsPromise,
  ])

  const { storeLimit, productLimit } = getPlanLimits({
    planId: plan?.id,
  })

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Plan and Usage</CardTitle>
          <div className="text-sm text-muted-foreground">
            You&apos;re currently on the{" "}
            <Badge
              variant="secondary"
              className="pointer-events-none text-foreground/90"
            >
              {plan?.title}
            </Badge>{" "}
            plan.{" "}
            {plan?.isCanceled
              ? "Your plan will be canceled on "
              : "Your plan renews on "}
            {plan?.stripeCurrentPeriodEnd ? (
              <span className="font-medium text-foreground/90">
                {formatDate(plan.stripeCurrentPeriodEnd)}.
              </span>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <UsageCard
            title="Stores"
            count={usageMetrics.storeCount}
            limit={storeLimit}
            moreInfo="The number of stores you can create on the current plan."
          />
          <UsageCard
            title="Products"
            count={usageMetrics.productCount}
            limit={productLimit}
            moreInfo="The number of products you can create on the current plan."
          />
        </CardContent>
      </Card>
      <section className="grid gap-6 lg:grid-cols-3">
        {plans.map((item, i) => (
          <Card
            key={item.title}
            className={cn("flex flex-col", {
              "sm:col-span-2 lg:col-span-1": i === plans.length - 1,
            })}
          >
            <CardHeader className="flex-1">
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="grid flex-1 place-items-start gap-6">
              <div className="text-3xl font-bold">
                {item.price}
                <span className="text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </div>
              <div className="w-full space-y-2">
                {item.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2">
                    <div className="aspect-square shrink-0 rounded-full bg-foreground p-px text-background">
                      <CheckIcon className="size-3.5" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              {item.title === "Free" ? (
                <Button className="w-full" asChild>
                  <Link href="/dashboard">
                    Get started
                    <span className="sr-only">Get started</span>
                  </Link>
                </Button>
              ) : (
                <ManagePlanForm
                  stripePriceId={item.stripePriceId}
                  stripeCustomerId={plan?.stripeCustomerId}
                  stripeSubscriptionId={plan?.stripeSubscriptionId}
                  isSubscribed={plan?.isSubscribed}
                  isCurrentPlan={plan?.title === item.title}
                />
              )}
            </CardFooter>
          </Card>
        ))}
      </section>
    </>
  )
}
