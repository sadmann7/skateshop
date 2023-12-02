import { cookies } from "next/headers"
import { db } from "@/db"
import { carts, products, stores } from "@/db/schema"
import type { CartLineItem } from "@/types"
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm"

export async function getCart(input?: {
  storeId: number
}): Promise<CartLineItem[]> {
  const cartId = cookies().get("cartId")?.value

  if (!cartId || isNaN(Number(cartId))) return []

  const cart = await db.query.carts.findFirst({
    columns: {
      items: true,
    },
    where: eq(carts.id, Number(cartId)),
  })

  const productIds = cart?.items?.map((item) => item.productId) ?? []

  if (productIds.length === 0) return []

  const uniqueProductIds = [...new Set(productIds)]

  const cartLineItems = await db
    .select({
      id: products.id,
      name: products.name,
      images: products.images,
      category: products.category,
      subcategory: products.subcategory,
      price: products.price,
      inventory: products.inventory,
      storeId: products.storeId,
      storeName: stores.name,
      storeStripeAccountId: stores.stripeAccountId,
    })
    .from(products)
    .leftJoin(stores, eq(stores.id, products.storeId))
    .where(
      and(
        inArray(products.id, uniqueProductIds),
        input?.storeId ? eq(products.storeId, input.storeId) : undefined
      )
    )
    .groupBy(products.id)
    .orderBy(desc(stores.stripeAccountId), asc(products.createdAt))
    .execute()
    .then((items) => {
      return items.map((item) => {
        const quantity = cart?.items?.find(
          (cartItem) => cartItem.productId === item.id
        )?.quantity

        return {
          ...item,
          quantity: quantity ?? 0,
        }
      })
    })

  return cartLineItems
}

export async function getUniqueStoreIds() {
  const cartId = cookies().get("cartId")?.value

  if (!cartId || isNaN(Number(cartId))) return []

  try {
    const cart = await db
      .selectDistinct({ storeId: products.storeId })
      .from(carts)
      .leftJoin(
        products,
        sql`JSON_CONTAINS(carts.items, JSON_OBJECT('productId', products.id))`
      )
      .groupBy(products.storeId)
      .where(eq(carts.id, Number(cartId)))

    const storeIds = cart.map((item) => Number(item.storeId)).filter((id) => id)

    return storeIds
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getCartItems(input: { cartId?: number }) {
  if (!input.cartId || isNaN(input.cartId)) return []

  try {
    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, input.cartId),
    })

    return cart?.items
  } catch (err) {
    console.error(err)
    return []
  }
}
