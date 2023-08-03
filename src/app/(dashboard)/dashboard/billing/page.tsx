import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"

import { storeSubscriptionPlans } from "@/config/subscriptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"
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
import { ManageStoreSubscriptionForm } from "@/components/forms/manage-store-subscription-form"
import { Header } from "@/components/header"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/shells/shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Billing",
  description: "Manage your billing and subscription",
}

export default async function BillingPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  const email =
    user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? ""

  const subscriptionPlan = await getUserSubscriptionPlan(user.id)

  return (
    <Shell variant="sidebar" as="div">
      <Header
        title="Billing"
        description="Manage your billing and subscription"
        size="sm"
      />
      <section
        id="billing-info"
        aria-labelledby="billing-info-heading"
        className="space-y-5"
      >
        <h2 className="text-xl font-semibold sm:text-2xl">Billing info</h2>
        <Card className="grid gap-4 p-6">
          <h3 className="text-lg font-semibold sm:text-xl">
            {subscriptionPlan?.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {!subscriptionPlan.isSubscribed
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
      <section
        id="subscription-plans"
        aria-labelledby="subscription-plans-heading"
        className="space-y-5 pb-2.5"
      >
        <h2 className="text-xl font-semibold sm:text-2xl">
          Subscription plans
        </h2>
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {storeSubscriptionPlans.map((plan, i) => (
            <Card
              key={plan.name}
              className={cn(
                "flex flex-col",
                i === storeSubscriptionPlans.length - 1 &&
                  "lg:col-span-2 xl:col-span-1"
              )}
            >
              <CardHeader>
                <CardTitle className="line-clamp-1">{plan.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid flex-1 place-items-start gap-6">
                <div className="text-3xl font-bold">
                  {formatPrice(plan.price, "USD", "compact")}
                  <span className="text-sm font-normal text-muted-foreground">
                    /month
                  </span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Icons.check className="h-4 w-4" aria-hidden="true" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                {plan.id === "basic" ? (
                  <Link href="/dashboard/stores" className="w-full">
                    <div
                      className={cn(
                        buttonVariants({
                          className: "w-full",
                        })
                      )}
                    >
                      Manage Stores
                      <span className="sr-only">Manage Stores</span>
                    </div>
                  </Link>
                ) : (
                  <ManageStoreSubscriptionForm
                    userId={user.id}
                    email={email}
                    stripePriceId={plan.stripePriceId}
                    stripeCustomerId={subscriptionPlan?.stripeCustomerId}
                    stripeSubscriptionId={
                      subscriptionPlan?.stripeSubscriptionId
                    }
                    isSubscribed={subscriptionPlan.isSubscribed}
                    isCurrentPlan={subscriptionPlan?.name === plan.name}
                  />
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </Shell>
  )
}
