import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { stripe } from "@/lib/stripe"
import { getUserSubscriptionPlan } from "@/lib/subscription"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your stores.",
}

export default async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const userStores = await db.query.stores.findMany({
    where: eq(stores.userId, user.id),
    with: {
      products: {
        columns: {
          id: true,
        },
      },
    },
  })

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
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <Tabs defaultValue="stores" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="space-y-4"></TabsContent>
        <TabsContent value="stores" className="space-y-4 sm:max-w-4xl">
          {userStores?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {userStores.map((store) => (
                <React.Suspense fallback={<Skeleton className="h-36 w-1/4" />}>
                  <Link
                    aria-label={`Go to ${store.name}`}
                    key={store.id}
                    href={`/dashboard/stores/${store.id}/products`}
                  >
                    <Card className="h-36 hover:bg-muted">
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <Icons.store className="h-5 w-5 text-muted-foreground" />
                          <CardTitle className="line-clamp-1">
                            {store.name}
                          </CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2 pt-1.5">
                          {store.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {store.products.length} products
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </React.Suspense>
              ))}
              {userStores.length < 3 && (
                <Link
                  aria-label="Create a new store"
                  href="/dashboard/stores/new"
                >
                  <Card className="h-36 hover:bg-muted">
                    <CardHeader className="pb-2.5">
                      <div className="flex items-center space-x-2">
                        <Icons.add className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="line-clamp-1">
                          Create a new store
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-2">
                        Create a new store to start selling your products.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              )}
            </div>
          ) : (
            <Link aria-label="Create a new store" href="/dashboard/stores/new">
              <Card className="h-36 hover:bg-muted">
                <CardHeader className="pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Icons.add className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="line-clamp-1">
                      Create a new store
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2">
                    Create a new store to start selling your products.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          )}
        </TabsContent>
        <TabsContent value="subscription" className="space-y-4">
          <form>
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>
                  You are currently on the <strong>Free</strong> plan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                The free plan allows you to create up to 3 stores and 10
                products per store.
              </CardContent>
              <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
                <Button>Upgrade to PRO</Button>
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
        </TabsContent>
      </Tabs>
    </section>
  )
}
