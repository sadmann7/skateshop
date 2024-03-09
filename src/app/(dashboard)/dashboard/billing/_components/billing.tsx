import Link from "next/link"
import type { SubscriptionPlanWithPrice, UserSubscriptionPlan } from "@/types"
import { CheckIcon } from "@radix-ui/react-icons"

import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ManageSubscriptionForm } from "./manage-subscription-form"

interface BillingProps {
  subscriptionPlanPromise: Promise<UserSubscriptionPlan | null>
  subscriptionPlansPromise: Promise<SubscriptionPlanWithPrice[]>
}

export async function Billing({
  subscriptionPlanPromise,
  subscriptionPlansPromise,
}: BillingProps) {
  const [subscriptionPlan, subscriptionPlans] = await Promise.all([
    subscriptionPlanPromise,
    subscriptionPlansPromise,
  ])

  return (
    <>
      <Card className="space-y-2.5 p-8">
        <CardTitle className="text-2xl">
          {subscriptionPlan?.title ?? "Free"}
        </CardTitle>
        <CardDescription>
          {!subscriptionPlan?.isSubscribed
            ? "Upgrade to unlock more features."
            : subscriptionPlan.isCanceled
              ? "Your plan will be canceled on "
              : "Your plan renews on "}
          {subscriptionPlan?.stripeCurrentPeriodEnd
            ? `${formatDate(subscriptionPlan.stripeCurrentPeriodEnd)}.`
            : null}
        </CardDescription>
      </Card>
      <section className="grid gap-6 lg:grid-cols-2">
        {subscriptionPlans.map((plan) => (
          <Card key={plan.title} className="flex flex-col p-4">
            <CardHeader className="h-full">
              <CardTitle className="line-clamp-1 text-2xl capitalize">
                {plan.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid h-full flex-1 place-items-start gap-6">
              <div className="text-3xl font-bold">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </div>
              <div className="w-full space-y-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="aspect-square shrink-0 rounded-full bg-foreground p-px text-background">
                      <CheckIcon className="size-4" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              {plan.title === "free" ? (
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
