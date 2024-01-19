"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { db } from "@/db"
import { carts, products } from "@/db/schema"
import { eq } from "drizzle-orm"
import { type z } from "zod"

import {
  cartItemSchema,
  deleteCartItemSchema,
  deleteCartItemsSchema,
} from "@/lib/validations/cart"

export async function addToCart(rawInput: z.infer<typeof cartItemSchema>) {
  const input = cartItemSchema.parse(rawInput)

  // Checking if product is in stock
  const product = await db.query.products.findFirst({
    columns: {
      inventory: true,
    },
    where: eq(products.id, input.productId),
  })

  if (!product) {
    throw new Error("Product not found, please try again.")
  }

  if (product.inventory < input.quantity) {
    throw new Error("Product is out of stock, please try again later.")
  }

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

  // If cart is closed, delete it and create a new one
  if (cart.closed) {
    await db.delete(carts).where(eq(carts.id, Number(cartId)))

    const newCart = await db.insert(carts).values({
      items: [input],
    })

    cookieStore.set("cartId", String(newCart.insertId))

    revalidatePath("/")
    return
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

export async function updateCartItem(rawInput: z.infer<typeof cartItemSchema>) {
  const input = cartItemSchema.parse(rawInput)

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

export async function deleteCart() {
  const cartId = Number(cookies().get("cartId")?.value)

  if (!cartId) {
    throw new Error("cartId not found, please try again.")
  }

  if (isNaN(cartId)) {
    throw new Error("Invalid cartId, please try again.")
  }

  await db.delete(carts).where(eq(carts.id, cartId))
}

export async function deleteCartItem(
  rawInput: z.infer<typeof deleteCartItemSchema>
) {
  const input = deleteCartItemSchema.parse(rawInput)

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

export async function deleteCartItems(
  rawInput: z.infer<typeof deleteCartItemsSchema>
) {
  const input = deleteCartItemsSchema.parse(rawInput)

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
