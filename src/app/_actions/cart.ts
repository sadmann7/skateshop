"use server"

import { cookies } from "next/headers"
import { db } from "@/db"
import { carts, products, stores } from "@/db/schema"
import type { CartItem, CartLineItem } from "@/types"
import { eq, inArray } from "drizzle-orm"

export async function getCartAction(): Promise<CartLineItem[]> {
  const cardId = cookies().get("cartId")?.value
    ? Number(cookies().get("cartId")?.value)
    : undefined

  if (!cardId) return []

  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, cardId),
  })

  const productIds = cart?.items?.map((item) => item.productId) ?? []

  if (!productIds.length) return []

  const cartLineItems = await db
    .select({
      id: products.id,
      name: products.name,
      images: products.images,
      price: products.price,
      inventory: products.inventory,
      storeId: products.storeId,
      storeName: stores.name,
    })
    .from(products)
    .leftJoin(stores, eq(stores.id, products.storeId))
    .where(inArray(products.id, productIds))

  return cartLineItems
}

export async function updateCartAction({ productId, quantity }: CartItem) {
  const cartId = cookies().get("cartId")?.value
    ? Number(cookies().get("cartId")?.value)
    : undefined

  if (!cartId) {
    const cart = await db.insert(carts).values({
      items: [{ productId, quantity }],
    })
    return cart
  }

  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, cartId),
  })

  if (!cart) {
    const cart = await db.insert(carts).values({
      items: [{ productId, quantity }],
    })
    return cart
  }

  const cartItem = cart.items?.find((item) => item.productId === productId)

  if (cartItem) {
    cartItem.quantity = quantity
  }

  if (!cartItem) {
    cart.items?.push({ productId, quantity })
  }

  await db
    .update(carts)
    .set({
      items: cart.items,
    })
    .where(eq(carts.id, cartId))

  return cart
}

export async function deleteCartAction() {
  const cartId = cookies().get("cartId")?.value
    ? Number(cookies().get("cartId")?.value)
    : undefined

  if (!cartId) return

  await db.delete(carts).where(eq(carts.id, cartId))
}

export async function deleteCartItemAction(productId: number) {
  const cartId = cookies().get("cartId")?.value
    ? Number(cookies().get("cartId")?.value)
    : undefined

  if (!cartId) return

  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, cartId),
  })

  if (!cart) return

  cart.items = cart.items?.filter((item) => item.productId !== productId) ?? []

  await db
    .update(carts)
    .set({
      items: cart.items,
    })
    .where(eq(carts.id, cartId))
}
