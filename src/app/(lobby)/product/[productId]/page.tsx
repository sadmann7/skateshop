import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products, stores } from "@/db/schema"
import { env } from "@/env.js"
import { and, desc, eq, not } from "drizzle-orm"

import { formatPrice, toTitleCase } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ProductCard } from "@/components/cards/product-card"
import { AddToCartForm } from "@/components/forms/add-to-cart-form"
import { Breadcrumbs } from "@/components/pagers/breadcrumbs"
import { ProductImageCarousel } from "@/components/product-image-carousel"
import { Rating } from "@/components/rating"
import { Shell } from "@/components/shell"
import { UpdateProductRatingButton } from "@/components/update-product-rating-button"

interface ProductPageProps {
  params: {
    productId: string
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const productId = Number(params.productId)

  const product = await db.query.products.findFirst({
    columns: {
      name: true,
      description: true,
    },
    where: eq(products.id, productId),
  })

  if (!product) {
    return {}
  }

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: toTitleCase(product.name),
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = Number(params.productId)

  const product = await db.query.products.findFirst({
    columns: {
      id: true,
      name: true,
      description: true,
      price: true,
      images: true,
      category: true,
      inventory: true,
      rating: true,
      storeId: true,
    },
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

  const otherProducts = store
    ? await db
        .select({
          id: products.id,
          name: products.name,
          price: products.price,
          images: products.images,
          category: products.category,
          inventory: products.inventory,
          rating: products.rating,
        })
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
    <Shell className="pb-12 md:pb-14">
      <Breadcrumbs
        segments={[
          {
            title: "Products",
            href: "/products",
          },
          {
            title: toTitleCase(product.category),
            href: `/products?category=${product.category}`,
          },
          {
            title: product.name,
            href: `/product/${product.id}`,
          },
        ]}
      />
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <ProductImageCarousel
          className="w-full md:w-1/2"
          images={product.images ?? []}
          options={{
            loop: true,
          }}
        />
        <Separator className="mt-4 md:hidden" />
        <div className="flex w-full flex-col gap-4 md:w-1/2">
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
          <Separator className="my-1.5" />
          <p className="text-base text-muted-foreground">
            {product.inventory} in stock
          </p>
          <div className="flex items-center justify-between">
            <Rating rating={Math.round(product.rating / 5)} />
            <UpdateProductRatingButton
              productId={product.id}
              rating={product.rating}
            />
          </div>
          <AddToCartForm productId={productId} showBuyNow={true} />
          <Separator className="mt-5" />
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="description"
          >
            <AccordionItem value="description" className="border-none">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                {product.description ??
                  "No description is available for this product."}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator className="md:hidden" />
        </div>
      </div>
      {store && otherProducts.length > 0 ? (
        <div className="space-y-6 overflow-hidden">
          <h2 className="line-clamp-1 flex-1 text-2xl font-bold">
            More products from {store.name}
          </h2>
          <ScrollArea orientation="horizontal" className="pb-3.5">
            <div className="flex gap-4">
              {otherProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="min-w-[260px]"
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : null}
    </Shell>
  )
}
