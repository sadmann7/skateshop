import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

import { getUserSubscriptionPlan } from "@/lib/subscription"
import { formatDate } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Header } from "@/components/header"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  title: "Billing",
  description: "Manage your billing and subscription.",
}

export default async function BillingPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const subscriptionPlan = await getUserSubscriptionPlan(user.id)

  // // If user has a pro plan, check cancel status on Stripe.
  // let isCanceled = false
  // if (subscriptionPlan?.isPro && subscriptionPlan?.stripeSubscriptionId) {
  //   const stripePlan = await stripe.subscriptions.retrieve(
  //     subscriptionPlan?.stripeSubscriptionId
  //   )
  //   isCanceled = stripePlan.cancel_at_period_end
  // }

  return (
    <section className="grid items-center gap-8 pb-8 pt-6 md:py-8">
      <Header
        title="Billing"
        description="Manage your billing and subscription."
        size="sm"
      />
      <div className="space-y-4">
        <Alert>
          <Icons.warning className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can create up to 3 stores on the kickflip plan.
          </AlertDescription>
        </Alert>
        <form>
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                You are currently on the <strong>Ollie</strong> plan.
              </CardDescription>
            </CardHeader>
            <CardContent>{subscriptionPlan.description}</CardContent>
            <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
              <Button>Upgrade to Kickflip</Button>
              {true ? (
                <p className="rounded-full text-xs font-medium">
                  {true
                    ? "Your plan will be canceled on "
                    : "Your plan renews on "}
                  {formatDate(
                    new Date(new Date().setDate(new Date().getDate() + 14))
                  )}
                  .
                </p>
              ) : null}
            </CardFooter>
          </Card>
        </form>
      </div>
    </section>
  )
}
