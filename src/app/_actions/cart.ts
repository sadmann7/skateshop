"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { db } from "@/db"
import { carts, products, stores } from "@/db/schema"
import type { CartItem, CartLineItem } from "@/types"
import { eq, inArray } from "drizzle-orm"

export async function getCartAction(): Promise<CartLineItem[]> {
  const cartId = cookies().get("cartId")?.value

  if (!cartId || isNaN(Number(cartId))) return []

  const cart = await db.query.carts.findFirst({
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
    })
    .from(products)
    .leftJoin(stores, eq(stores.id, products.storeId))
    .where(inArray(products.id, uniqueProductIds))

  const allCartLineItems = cartLineItems.map((item) => {
    const quantity = cart?.items?.find(
      (cartItem) => cartItem.productId === item.id
    )?.quantity

    return {
      ...item,
      quantity,
    }
  })

  return allCartLineItems
}

export async function getCartItemsAction(input: { cartId?: number }) {
  if (!input.cartId || isNaN(input.cartId)) return []

  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, input.cartId),
  })

  return cart?.items
}

export async function addToCartAction(input: CartItem) {
  const cookieStore = cookies()
  const cartId = cookieStore.get("cartId")?.value

  if (!cartId) {
    const cart = await db.insert(carts).values({
      items: [input],
    })

    // Note: .set() is only available in a Server Action or Route Handler
    cookieStore.set("cartId", String(cart.insertId))

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

  // If this is a new product, create a new cart item. Otherwise, update the quantity of the existing cart item
  if (input.quantity > 0) {
    if (cartItem) {
      if (input.quantity === 1) {
        cartItem.quantity += 1
      } else {
        cartItem.quantity = input.quantity
      }
    } else {
      cart.items?.push(input)
    }
  }
  // If the quantity is 0, remove the item from the cart
  else if (cartItem) {
    cart.items =
      cart.items?.filter((item) => item.productId !== input.productId) ?? []
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
  const cartId = Number(cookies().get("cartId")?.value)

  if (!cartId) {
    throw new Error("cartId not found, please try again.")
  }

  if (isNaN(cartId)) {
    throw new Error("Invalid cartId, please try again.")
  }

  await db.delete(carts).where(eq(carts.id, cartId))
}

export async function deleteCartItemAction(input: { productId: number }) {
  const cartId = Number(cookies().get("cartId")?.value)

  if (!cartId) {
    throw new Error("cartId not found, please try again.")
  }

  if (isNaN(cartId)) {
    throw new Error("Invalid cartId, please try again.")
  }

  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, cartId),
  })

  if (!cart) return

  cart.items =
    cart.items?.filter((item) => item.productId !== input.productId) ?? []

  await db
    .update(carts)
    .set({
      items: cart.items,
    })
    .where(eq(carts.id, cartId))

  revalidatePath("/")
}

export async function deleteCartItemsAction(input: { productIds: number[] }) {
  const cartId = cookies().get("cartId")?.value

  if (!cartId) {
    throw new Error("cartId not found, please try again.")
  }

  if (isNaN(Number(cartId))) {
    throw new Error("Invalid cartId, please try again.")
  }

  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, Number(cartId)),
  })

  if (!cart) return

  cart.items =
    cart.items?.filter((item) => !input.productIds.includes(item.productId)) ??
    []

  await db
    .update(carts)
    .set({
      items: cart.items,
    })
    .where(eq(carts.id, Number(cartId)))

  revalidatePath("/")
}
