import Link from "next/link"
import type { SubscriptionPlanWithPrice, UserSubscriptionPlan } from "@/types"
import { CheckIcon } from "@radix-ui/react-icons"

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
import { UsageCard } from "@/components/cards/usage-card"
import { ManageSubscriptionForm } from "@/components/manage-subscription-form"

interface BillingProps {
  subscriptionPlanPromise: Promise<UserSubscriptionPlan | null>
  subscriptionPlansPromise: Promise<SubscriptionPlanWithPrice[]>
  usagePromise: Promise<{
    storeCount: number
    productCount: number
  }>
}

export async function Billing({
  subscriptionPlanPromise,
  subscriptionPlansPromise,
  usagePromise,
}: BillingProps) {
  const [subscriptionPlan, subscriptionPlans, usage] = await Promise.all([
    subscriptionPlanPromise,
    subscriptionPlansPromise,
    usagePromise,
  ])

  const { storeLimit, productLimit } = getPlanLimits({
    planTitle: subscriptionPlan?.title,
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
              {subscriptionPlan?.title}
            </Badge>{" "}
            plan.{" "}
            {subscriptionPlan?.isCanceled
              ? "Your plan will be canceled on "
              : "Your plan renews on "}
            {subscriptionPlan?.stripeCurrentPeriodEnd ? (
              <span className="font-medium text-foreground/90">
                {formatDate(subscriptionPlan.stripeCurrentPeriodEnd)}.
              </span>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <UsageCard
            title="Stores"
            count={usage.storeCount}
            limit={storeLimit}
            moreInfo="The number of stores you can create on the current plan."
          />
          <UsageCard
            title="Products"
            count={usage.productCount}
            limit={productLimit}
            moreInfo="The number of products you can create on the current plan."
          />
        </CardContent>
      </Card>
      <section className="grid gap-6 lg:grid-cols-3">
        {subscriptionPlans.map((plan, i) => (
          <Card
            key={plan.title}
            className={cn("flex flex-col", {
              "sm:col-span-2 lg:col-span-1": i === subscriptionPlans.length - 1,
            })}
          >
            <CardHeader className="flex-1">
              <CardTitle className="text-lg">{plan.title}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="grid flex-1 place-items-start gap-6">
              <div className="text-3xl font-bold">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </div>
              <div className="w-full space-y-2">
                {plan.features.map((feature) => (
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
              {plan.title === "Free" ? (
                <Button className="w-full" asChild>
                  <Link href="/dashboard">
                    Get started
                    <span className="sr-only">Get started</span>
                  </Link>
                </Button>
              ) : (
                <ManageSubscriptionForm
                  stripePriceId={plan.stripePriceId}
                  stripeCustomerId={subscriptionPlan?.stripeCustomerId}
                  stripeSubscriptionId={subscriptionPlan?.stripeSubscriptionId}
                  isSubscribed={subscriptionPlan?.isSubscribed ?? false}
                  isCurrentPlan={subscriptionPlan?.title === plan.title}
                />
              )}
            </CardFooter>
          </Card>
        ))}
      </section>
    </>
  )
}
