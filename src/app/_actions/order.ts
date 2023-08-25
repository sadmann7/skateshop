"use server"

import { db } from "@/db"
import { products, stores } from "@/db/schema"
import { desc, eq, inArray } from "drizzle-orm"
import { type z } from "zod"

import type { getOrderedProductsSchema } from "@/lib/validations/order"

export async function getOrderedProducts(
  input: z.infer<typeof getOrderedProductsSchema>
) {
  const { orderedProducts, store } = await db.transaction(async (tx) => {
    const orderedProducts = await tx
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        images: products.images,
        storeId: products.storeId,
      })
      .from(products)
      .where(
        inArray(
          products.id,
          input.checkoutItems.map((item) => item.productId)
        )
      )
      .orderBy(desc(products.createdAt))

    const store = await tx.query.stores.findFirst({
      columns: {
        name: true,
      },
      where: eq(stores.id, input.storeId),
    })

    const productsWithQuantity = orderedProducts.map((product) => {
      const quantity = input.checkoutItems.find(
        (item) => item.productId === product.id
      )?.quantity

      return {
        ...product,
        quantity: quantity ?? 0,
      }
    })

    return {
      orderedProducts: productsWithQuantity,
      store,
    }
  })

  return {
    orderedProducts,
    storeName: store?.name ?? "Store",
  }
}
