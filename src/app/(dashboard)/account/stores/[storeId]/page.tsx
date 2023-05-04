import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { Prisma } from "@prisma/client"

import { prisma } from "@/lib/db"
import { EditStoreForm } from "@/components/forms/edit-store-form"
import { Header } from "@/components/header"
import { Products } from "@/components/products"

export const metadata: Metadata = {
  title: "Manage Store",
  description: "Manage your store and products.",
}

interface EditStorePageProps {
  params: {
    storeId: string
  }
}

async function getProducts(
  storeId: string,
  page: number,
  perPage: number,
  name?: string,
  sortBy?: string,
  sortDesc?: boolean
) {
  const params: Prisma.ProductFindManyArgs = {
    orderBy: sortBy ? { [sortBy]: sortDesc ? "desc" : "asc" } : undefined,
    where: {
      storeId,
      name: name ? { contains: name } : undefined,
    },
  }

  const [count, products] = await prisma.$transaction([
    prisma.product.count({ where: params.where }),
    prisma.product.findMany({
      ...params,
      skip: page * perPage,
      take: perPage,
    }),
  ])

  return { count, products }
}

export default async function EditStorePage({ params }: EditStorePageProps) {
  const { storeId } = params

  const store = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
    select: {
      id: true,
    },
  })

  if (!store) {
    notFound()
  }

  const products = await getProducts(storeId, 0, 10)
  console.log(products)

  return (
    <section className="container grid w-full items-center gap-6 pb-8 pt-6 md:py-10">
      <Header
        title="Manage Store"
        description="Manage your store and products."
      />
      <Products data={products} storeId={storeId} />
    </section>
  )
}
