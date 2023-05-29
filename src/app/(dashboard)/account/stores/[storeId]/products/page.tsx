import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { SortDirection } from "@/types"
import { type Product } from "@prisma/client"

import { prisma } from "@/lib/db"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Icons } from "@/components/icons"
import { Products } from "@/components/products"
import { ProductsTable } from "@/components/products-table"

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your products.",
}

interface ProductsPageProps {
  params: {
    storeId: string
  }
  searchParams: {
    page?: string
    items?: string
    sort?: keyof Product
    order?: SortDirection
    query?: string
  }
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { storeId } = params

  const { page, items, sort, order, query } = searchParams

  const store = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
    select: {
      id: true,
      name: true,
    },
  })

  if (!store) {
    notFound()
  }

  // Number of skaters to show per page
  const limit = items ? parseInt(items) : 10
  // Number of skaters to skip
  const offset = page ? (parseInt(page) - 1) * limit : 0

  // Get skaters and total skaters count in a single query
  const [products, totalProducts] = await prisma.$transaction([
    prisma.product.findMany({
      // For server-side pagination
      take: limit,
      skip: offset,
      // For server-side filtering
      where: {
        name: query ? { contains: query } : undefined,
        storeId,
      },
      // For server-side sorting
      orderBy: { [sort ?? "createdAt"]: order ?? "asc" },
    }),
    prisma.product.count(),
  ])

  // Page count
  const pageCount = Math.ceil(totalProducts / limit)

  return (
    <section className="container grid w-full items-center space-y-10 pb-20 pt-6 md:py-10">
      <Header title={store.name} description="Manage your products." />
      <div className="flex flex-col items-center justify-center gap-2.5 sm:flex-row">
        <Link href={`/account/stores/${storeId}`} className="w-full sm:w-fit">
          <div
            className={cn(
              buttonVariants({
                size: "sm",
                variant: "outline",
              }),
              "w-full sm:w-auto"
            )}
          >
            <Icons.store className="mr-2 h-4 w-4" />
            Manage Store
            <span className="sr-only">Manage Store</span>
          </div>
        </Link>
        <Link
          href={`/account/stores/${storeId}/products`}
          className="w-full sm:w-fit"
        >
          <div
            className={cn(
              buttonVariants({
                size: "sm",
                variant: "secondary",
              }),
              "w-full sm:w-auto"
            )}
          >
            <Icons.product className="mr-2 h-4 w-4" />
            Manage Products
            <span className="sr-only">Manage Products</span>
          </div>
        </Link>
      </div>
      <ProductsTable data={products} pageCount={pageCount} />
    </section>
  )
}
