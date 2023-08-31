"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { db } from "@/db"
import { carts, products, stores } from "@/db/schema"
import type { CartLineItem } from "@/types"
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm"
import { type z } from "zod"

import type {
  cartItemSchema,
  deleteCartItemSchema,
  deleteCartItemsSchema,
} from "@/lib/validations/cart"

export async function getCartAction(storeId?: number): Promise<CartLineItem[]> {
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
        storeId ? eq(products.storeId, storeId) : undefined
      )
    )
    .groupBy(products.id)
    .orderBy(desc(stores.stripeAccountId), asc(products.createdAt))
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

  const cart = await db
    .select({ storeId: products.storeId })
    .from(carts)
    .leftJoin(
      products,
      sql`JSON_CONTAINS(carts.items, JSON_OBJECT('productId', products.id))`
    )
    .groupBy(products.storeId)
    .where(eq(carts.id, Number(cartId)))

  const storeIds = cart.map((item) => Number(item.storeId)).filter((id) => id)

  const uniqueStoreIds = [...new Set(storeIds)]

  return uniqueStoreIds
}

export async function getCartItemsAction(input: { cartId?: number }) {
  if (!input.cartId || isNaN(input.cartId)) return []

  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, input.cartId),
  })

  return cart?.items
}

export async function addToCartAction(input: z.infer<typeof cartItemSchema>) {
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

  // TODO: Find a better way to deal with expired carts
  if (!cart) {
    cookieStore.set({
      name: "cartId",
      value: "",
      expires: new Date(0),
    })

    await db.delete(carts).where(eq(carts.id, Number(cartId)))

    throw new Error("Cart not found, please try again.")
  }

  const cartItem = cart.items?.find(
    (item) => item.productId === input.productId
  )

  if (cartItem) {
    cartItem.quantity += input.quantity
  } else {
    cart.items?.push(input)
  }

  await db
    .update(carts)
    .set({
      items: cart.items,
    })
    .where(eq(carts.id, Number(cartId)))

  revalidatePath("/")
}

export async function updateCartItemAction(
  input: z.infer<typeof cartItemSchema>
) {
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

  if (!cart) {
    throw new Error("Cart not found, please try again.")
  }

  const cartItem = cart.items?.find(
    (item) => item.productId === input.productId
  )

  if (!cartItem) {
    throw new Error("CartItem not found, please try again.")
  }

  if (input.quantity === 0) {
    cart.items =
      cart.items?.filter((item) => item.productId !== input.productId) ?? []
  } else {
    cartItem.quantity = input.quantity
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

export async function deleteCartItemAction(
  input: z.infer<typeof deleteCartItemSchema>
) {
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
    cart.items?.filter((item) => item.productId !== input.productId) ?? []

  await db
    .update(carts)
    .set({
      items: cart.items,
    })
    .where(eq(carts.id, Number(cartId)))

  revalidatePath("/")
}

export async function deleteCartItemsAction(
  input: z.infer<typeof deleteCartItemsSchema>
) {
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
