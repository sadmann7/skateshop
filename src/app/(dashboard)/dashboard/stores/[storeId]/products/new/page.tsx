import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { and, eq } from "drizzle-orm"

import { AddProductForm } from "@/components/forms/add-product-form"

export const metadata: Metadata = {
  title: "New Product",
  description: "Add a new product.",
}

interface NewProductPageProps {
  params: {
    storeId: number
  }
}

export default async function NewProductPage({ params }: NewProductPageProps) {
  const { storeId } = params

  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const store = await db.query.stores.findFirst({
    where: and(eq(stores.id, storeId), eq(stores.userId, user.id)),
    columns: {
      id: true,
    },
  })

  if (!store) {
    notFound()
  }

  return (
    <section className="grid items-center gap-6 pb-8 pt-6 md:py-8">
      <AddProductForm storeId={storeId} />
    </section>
  )
}
