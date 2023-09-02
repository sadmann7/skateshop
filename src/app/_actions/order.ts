"use server"

import { db } from "@/db"
import { products } from "@/db/schema"
import type { CartLineItem } from "@/types"
import { desc, inArray } from "drizzle-orm"
import { z } from "zod"

import { checkoutItemSchema } from "@/lib/validations/cart"
import type { getOrderLineItemsSchema } from "@/lib/validations/order"

export async function getOrderLineItemsAction(
  input: z.infer<typeof getOrderLineItemsSchema>
): Promise<CartLineItem[]> {
  try {
    const safeParsedItems = z
      .array(checkoutItemSchema)
      .safeParse(JSON.parse(input.items ?? "[]"))

    if (!safeParsedItems.success) {
      throw new Error("Could not parse items.")
    }

    const lineItems = await db
      .select({
        id: products.id,
        name: products.name,
        images: products.images,
        category: products.category,
        subcategory: products.subcategory,
        price: products.price,
        inventory: products.inventory,
        storeId: products.storeId,
      })
      .from(products)
      .where(
        inArray(
          products.id,
          safeParsedItems.data.map((item) => item.productId)
        )
      )
      .groupBy(products.id)
      .orderBy(desc(products.createdAt))
      .execute()
      .then((items) => {
        return items.map((item) => {
          const quantity = safeParsedItems.data.find(
            (checkoutItem) => checkoutItem.productId === item.id
          )?.quantity

          return {
            ...item,
            quantity: quantity ?? 0,
          }
        })
      })

    return lineItems
  } catch (err) {
    console.error(err)
    return []
  }
}
