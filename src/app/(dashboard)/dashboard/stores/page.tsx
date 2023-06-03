import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { getUserSubscriptionPlan } from "@/lib/subscription"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  title: "Stores",
  description: "Manage your stores.",
}

export default async function StoresPage() {
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

  return (
    <section className="grid items-center gap-8 pb-8 pt-6 md:py-8">
      <Header title="Stores" description="Manage your stores." size="sm" />
      <div className="space-y-4">
        <Alert>
          <Icons.warning className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You are on the {subscriptionPlan?.name.toLowerCase()} plan. Upgrade to the{" "}
            kickflip plan to create up to 3 stores.
          </AlertDescription>
        </Alert>
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
      </div>
    </section>
  )
}
