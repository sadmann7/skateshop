"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { db } from "@/db"
import { carts, products, stores } from "@/db/schema"
import type { CartItem, CartLineItem } from "@/types"
import { eq, inArray } from "drizzle-orm"

export async function getCartAction(): Promise<CartLineItem[]> {
  const cartId = cookies().get("cartId")?.value

  console.log("do a kickflip")

  if (!cartId) return []

  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, Number(cartId)),
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

export async function addToCartAction(input: CartItem) {
  const cookieStore = cookies()
  const cartId = cookieStore.get("cartId")?.value

  if (!cartId) {
    const cart = await db.insert(carts).values({
      items: [input],
    })

    cookieStore.set("cartId", String(cart.insertId), {
      path: "/",
      sameSite: "strict",
    })

    revalidatePath("/")
    return
  }

  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, Number(cartId)),
  })

  if (!cart) {
    throw new Error("Cart not found, please try again.")
  }

  const cartItem = cart.items?.find(
    (item) => item.productId === input.productId
  )

  if (!cartItem) {
    cart.items?.push(input)
  } else {
    cartItem.quantity += input.quantity
  }

  await db
    .update(carts)
    .set({
      items: cart.items,
    })
    .where(eq(carts.id, Number(cartId)))

  revalidatePath("/")
}

export async function deleteCartAction() {
  const cartId = cookies().get("cartId")?.value

  if (!cartId) return

  await db.delete(carts).where(eq(carts.id, Number(cartId)))
}

export async function deleteCartItemAction(input: { productId: number }) {
  const cartId = cookies().get("cartId")?.value

  if (!cartId) return

  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, Number(cartId)),
  })

  if (!cart) return

  cart.items =
    cart.items?.filter((item) => item.productId !== input.productId) ?? []

  await db
    .update(carts)
    .set({
      items: cart.items,
    })
    .where(eq(carts.id, Number(cartId)))

  revalidatePath("/")
}
