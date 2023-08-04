import { type Metadata } from "next"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { db } from "@/db"
import { products, stores } from "@/db/schema"
import { env } from "@/env.mjs"
import { and, eq, not } from "drizzle-orm"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UpdateStoreForm } from '@/components/forms/update-store-form';
import { ConnectStoreToStripeButton } from "@/components/connect-store-to-stripe-button"
import { checkStripeConnectionAction } from "@/app/_actions/stripe"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Manage Store",
  description: "Manage your store",
}

interface UpdateStorePageProps {
  params: {
    storeId: string
  }
}

export default async function UpdateStorePage({
  params,
}: UpdateStorePageProps) {
  const storeId = Number(params.storeId)

  async function updateStore(fd: FormData) {
    "use server"

    const name = fd.get("name") as string
    const description = fd.get("description") as string

    const storeWithSameName = await db.query.stores.findFirst({
      where: and(eq(stores.name, name), not(eq(stores.id, storeId))),
      columns: {
        id: true,
      },
    })

    if (storeWithSameName) {
      throw new Error("Store name already taken")
    }

    await db
      .update(stores)
      .set({ name, description })
      .where(eq(stores.id, storeId))

    revalidatePath(`/dashboard/stores/${storeId}`)
  }

  async function deleteStore() {
    "use server"

    const store = await db.query.stores.findFirst({
      where: eq(stores.id, storeId),
      columns: {
        id: true,
      },
    })

    if (!store) {
      throw new Error("Store not found")
    }

    await db.delete(stores).where(eq(stores.id, storeId))

    // Delete all products of this store
    await db.delete(products).where(eq(products.storeId, storeId))

    const path = "/dashboard/stores"
    revalidatePath(path)
    redirect(path)
  }

  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
    columns: {
      id: true,
      name: true,
      description: true,
    },
  })

  if (!store) {
    notFound()
  }

  const isConnectedToStripe = await checkStripeConnectionAction({ storeId })

  return (
    <div className="space-y-6">
      <Card
        as="section"
        id="connect-store-to-stripe"
        aria-labelledby="connect-store-to-stripe-heading"
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
          {!isConnectedToStripe ? (
            <Link href="https://dashboard.stripe.com/">
              <div className={cn(buttonVariants())}>Manage Stripe account</div>
            </Link>
          ) : (
            <ConnectStoreToStripeButton storeId={storeId} />
          )}
        </CardContent>
      </Card>
      <Card
        as="section"
        id="update-store"
        aria-labelledby="update-store-heading"
      >
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Update your store</CardTitle>
          <CardDescription>
            Update your store name and description, or delete it
          </CardDescription>
        </CardHeader>
        <CardContent>
        <UpdateStoreForm store={store} updateStore={updateStore} deleteStore={deleteStore} />
      </CardContent>
      </Card>
    </div>
  )
}