import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { env } from "@/env.js"
import { CheckIcon } from "@radix-ui/react-icons"

import { storeSubscriptionPlans } from "@/config/subscriptions"
import { getCacheduser } from "@/lib/actions/auth"
import { getSubscriptionPlan } from "@/lib/fetchers/stripe"
import { cn, formatDate, formatPrice } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ManageSubscriptionForm } from "@/components/forms/manage-subscription-form"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shells/shell"

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

  const subscriptionPlan = await getSubscriptionPlan({ userId: user.id })

  return (
    <Shell variant="sidebar" as="div">
      <PageHeader separated>
        <PageHeaderHeading size="sm">Billing</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your billing and subscription
        </PageHeaderDescription>
      </PageHeader>
      <section>
        <Card className="grid gap-4 p-6">
          <h3 className="text-lg font-semibold sm:text-xl">
            {subscriptionPlan?.name ?? "Ollie"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {!subscriptionPlan?.isSubscribed
              ? "Upgrade to create more stores and products."
              : subscriptionPlan.isCanceled
                ? "Your plan will be canceled on "
                : "Your plan renews on "}
            {subscriptionPlan?.stripeCurrentPeriodEnd
              ? `${formatDate(subscriptionPlan.stripeCurrentPeriodEnd)}.`
              : null}
          </p>
        </Card>
      </section>
      <section className="grid gap-6 pb-2.5 lg:grid-cols-2 xl:grid-cols-3">
        {storeSubscriptionPlans.map((plan, i) => (
          <Card
            key={plan.name}
            className={cn(
              "flex flex-col",
              i === storeSubscriptionPlans.length - 1 &&
                "lg:col-span-2 xl:col-span-1",
              i === 1 && "border-primary shadow-md"
            )}
          >
            <CardHeader className="h-full">
              <CardTitle className="line-clamp-1">{plan.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid h-full flex-1 place-items-start gap-6">
              <div className="text-3xl font-bold">
                {formatPrice(plan.price, {
                  currency: "USD",
                })}
                <span className="text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </div>
              <div className="space-y-2">
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
              {plan.id === "basic" ? (
                <Link
                  href="/dashboard/stores"
                  className={cn(
                    buttonVariants({
                      className: "w-full",
                    })
                  )}
                >
                  Get started
                  <span className="sr-only">Get started</span>
                </Link>
              ) : (
                <ManageSubscriptionForm
                  stripePriceId={plan.stripePriceId}
                  stripeCustomerId={subscriptionPlan?.stripeCustomerId}
                  stripeSubscriptionId={subscriptionPlan?.stripeSubscriptionId}
                  isSubscribed={subscriptionPlan?.isSubscribed ?? false}
                  isCurrentPlan={subscriptionPlan?.name === plan.name}
                />
              )}
            </CardFooter>
          </Card>
        ))}
      </section>
    </Shell>
  )
}
