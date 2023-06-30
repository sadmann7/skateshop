import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products, stores } from "@/db/schema"
import { and, desc, eq, not } from "drizzle-orm"

import { cn, formatPrice } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingButton } from "@/components/ui/loading-button"
import { Separator } from "@/components/ui/separator"
import { UpdateCartItemForm } from "@/components/forms/update-cart-item-form"
import { Header } from "@/components/header"
import { ImageCarousel } from "@/components/image-carousel"
import { ProductCard } from "@/components/product-card"
import { Shell } from "@/components/shell"
import { addToCartAction } from "@/app/_actions/cart"

export const metadata: Metadata = {
  title: "Product",
  description: "Product description",
}

interface PrdouctPageProps {
  params: {
    productId: string
  }
}

export default async function ProductPage({ params }: PrdouctPageProps) {
  const productId = Number(params.productId)

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  })

  if (!product) {
    notFound()
  }

  const store = await db.query.stores.findFirst({
    columns: {
      id: true,
      name: true,
    },
    where: eq(stores.id, product.storeId),
  })

  const productsFromStore = store
    ? await db
        .select()
        .from(products)
        .limit(4)
        .where(
          and(
            eq(products.storeId, product.storeId),
            not(eq(products.id, productId))
          )
        )
        .orderBy(desc(products.inventory))
    : []

  return (
    <Shell>
      <Header title="Product" size="sm" />
      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        <ImageCarousel
          className="w-full md:w-2/5"
          data={product.images ?? []}
          asChild
        />
        <div className="flex w-full flex-col space-y-4 md:w-3/5">
          <div className="space-y-2">
            <h2 className="line-clamp-1 text-2xl font-bold">{product.name}</h2>
            <p className="text-base text-muted-foreground">
              {formatPrice(product.price)}
            </p>
            {store ? (
              <Link
                href={`/products?store_ids=${store.id}`}
                className="line-clamp-1 inline-block text-base text-muted-foreground hover:underline"
              >
                {store.name}
              </Link>
            ) : null}
          </div>
          <Separator className="my-6" />
          <UpdateCartItemForm productId={productId} />
        </div>
      </div>
      {store && productsFromStore.length > 0 ? (
        <div className="overflow-hidden pt-6">
          <h2 className="line-clamp-1 flex-1 text-2xl font-bold">
            More products from {store.name}
          </h2>

          <div className="overflow-x-auto pb-2 pt-6">
            <div className="flex w-fit gap-4">
              {productsFromStore.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="min-w-[260px]"
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Shell>
  )
}
