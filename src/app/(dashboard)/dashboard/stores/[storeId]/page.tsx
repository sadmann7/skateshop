import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { env } from "@/env.js"
import { eq } from "drizzle-orm"

import { deleteStore, updateStore } from "@/lib/actions/store"
import { getStripeAccount } from "@/lib/actions/stripe"
import { cn, formatDate } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ConnectStoreToStripeButton } from "@/components/connect-store-to-stripe-button"
import { LoadingButton } from "@/components/loading-button"

interface UpdateStorePageProps {
  params: {
    storeId: string
  }
}

async function getStoreFromParams(params: UpdateStorePageProps["params"]) {
  const storeId = decodeURIComponent(params.storeId)

  const store = await db.query.stores.findFirst({
    columns: {
      id: true,
      name: true,
      description: true,
    },
    where: eq(stores.id, storeId),
  })

  if (!store) return null

  return store
}

export async function generateMetadata({
  params,
}: UpdateStorePageProps): Promise<Metadata> {
  const store = await getStoreFromParams(params)

  if (!store) {
    return {}
  }

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: `Update ${store.name} store`,
    description: `Update your ${store.name} store name and description, or delete it`,
  }
}

export default async function UpdateStorePage({
  params,
}: UpdateStorePageProps) {
  const store = await getStoreFromParams(params)

  if (!store) {
    notFound()
  }

  const { account: stripeAccount } = await getStripeAccount({
    storeId: store.id,
  })

  return (
    <div className="space-y-10">
      {stripeAccount ? (
        <Card as="section">
          <CardHeader className="space-y-1">
            <CardTitle className="line-clamp-1 text-2xl">
              Manage Stripe account
            </CardTitle>
            <CardDescription>
              Manage your Stripe account and view your payouts
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2.5">
              <Label htmlFor="stripe-account-email">Email</Label>
              <Input
                id="stripe-account-email"
                name="stripeAccountEmail"
                readOnly
                defaultValue={stripeAccount.email ?? "N/A"}
              />
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="stripe-account-country">Country</Label>
              <Input
                id="stripe-account-country"
                name="stripeAccountCountry"
                readOnly
                defaultValue={stripeAccount.country}
              />
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="stripe-account-currency">Currency</Label>
              <Input
                id="stripe-account-currency"
                name="stripeAccountCurrency"
                className="uppercase"
                readOnly
                defaultValue={stripeAccount.default_currency}
              />
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="stripe-account-created">Created</Label>
              <Input
                id="stripe-account-created"
                name="stripeAccountCreated"
                readOnly
                defaultValue={
                  stripeAccount.created
                    ? formatDate(stripeAccount.created * 1000)
                    : "N/A"
                }
              />
            </div>
          </CardContent>
          <CardFooter>
            <Link
              aria-label="Manage Stripe account"
              href="https://dashboard.stripe.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({
                  className: "text-center",
                })
              )}
            >
              Manage Stripe account
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <Card
          as="section"
          id="connect-to-stripe"
          aria-labelledby="connect-to-stripe-heading"
        >
          <CardHeader className="space-y-1">
            <CardTitle className="line-clamp-1 text-2xl">
              Connect to Stripe
            </CardTitle>
            <CardDescription>
              Connect your store to Stripe to start accepting payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectStoreToStripeButton storeId={store.id} />
          </CardContent>
        </Card>
      )}
      <Card as="section">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Update your store</CardTitle>
          <CardDescription>
            Update your store name and description, or delete it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={updateStore.bind(null, store.id)}
            className="grid w-full max-w-xl gap-5"
          >
            <div className="grid gap-2.5">
              <Label htmlFor="update-store-name">Name</Label>
              <Input
                id="update-store-name"
                aria-describedby="update-store-name-description"
                name="name"
                required
                minLength={3}
                maxLength={50}
                placeholder="Type store name here."
                defaultValue={store.name}
              />
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="update-store-description">Description</Label>
              <Textarea
                id="update-store-description"
                aria-describedby="update-store-description-description"
                name="description"
                minLength={3}
                maxLength={255}
                placeholder="Type store description here."
                defaultValue={store.description ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2 xs:flex-row">
              <LoadingButton action="update">
                Update store
                <span className="sr-only">Update store</span>
              </LoadingButton>
              <LoadingButton
                formAction={deleteStore.bind(null, store.id)}
                variant="destructive"
                action="delete"
              >
                Delete store
                <span className="sr-only">Delete store</span>
              </LoadingButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
