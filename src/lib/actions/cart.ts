"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { db } from "@/db"
import { carts, categories, products, stores, subcategories } from "@/db/schema"
import type { CartLineItem } from "@/types"
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm"
import { type z } from "zod"

import { getErrorMessage } from "@/lib/handle-error"
import {
  cartItemSchema,
  type deleteCartItemSchema,
  type deleteCartItemsSchema,
} from "@/lib/validations/cart"

export async function getCart(input?: {
  storeId: string
}): Promise<CartLineItem[]> {
  noStore()

  const cartId = cookies().get("cartId")?.value

  if (!cartId) return []

  try {
    const cart = await db.query.carts.findFirst({
      columns: {
        items: true,
      },
      where: eq(carts.id, cartId),
    })

    const productIds = cart?.items?.map((item) => item.productId) ?? []

    if (productIds.length === 0) return []

    const uniqueProductIds = [...new Set(productIds)]

    const cartLineItems = await db
      .select({
        id: products.id,
        name: products.name,
        images: products.images,
        category: categories.name,
        subcategory: subcategories.name,
        price: products.price,
        inventory: products.inventory,
        storeId: products.storeId,
        storeName: stores.name,
        storeStripeAccountId: stores.stripeAccountId,
      })
      .from(products)
      .leftJoin(stores, eq(stores.id, products.storeId))
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .leftJoin(subcategories, eq(subcategories.id, products.subcategoryId))
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
  } catch (err) {
    return []
  }
}

export async function getUniqueStoreIds() {
  noStore()

  const cartId = cookies().get("cartId")?.value

  if (!cartId) return []

  try {
    const cart = await db
      .selectDistinct({ storeId: products.storeId })
      .from(carts)
      .leftJoin(
        products,
        sql`JSON_CONTAINS(carts.items, JSON_OBJECT('productId', products.id))`
      )
      .groupBy(products.storeId)
      .where(eq(carts.id, cartId))

    const storeIds = cart.map((item) => Number(item.storeId)).filter((id) => id)

    return storeIds
  } catch (err) {
    return []
  }
}

export async function getCartItems(input: { cartId?: string }) {
  noStore()

  if (!input.cartId) return []

  try {
    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, input.cartId),
    })

    return cart?.items
  } catch (err) {
    return []
  }
}

export async function addToCart(rawInput: z.infer<typeof cartItemSchema>) {
  noStore()

  try {
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
      const cart = await db
        .insert(carts)
        .values({
          items: [input],
        })
        .returning({ insertedId: carts.id })

      // Note: .set() is only available in a Server Action or Route Handler
      cookieStore.set("cartId", String(cart[0]?.insertedId))

      revalidatePath("/")
      return {
        data: [input],
        error: null,
      }
    }

    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
    })

    // TODO: Find a better way to deal with expired carts
    if (!cart) {
      cookieStore.set({
        name: "cartId",
        value: "",
        expires: new Date(0),
      })

      await db.delete(carts).where(eq(carts.id, cartId))

      throw new Error("Cart not found, please try again.")
    }

    // If cart is closed, delete it and create a new one
    if (cart.closed) {
      await db.delete(carts).where(eq(carts.id, cartId))

      const newCart = await db
        .insert(carts)
        .values({
          items: [input],
        })
        .returning({ insertedId: carts.id })

      cookieStore.set("cartId", String(newCart[0]?.insertedId))

      revalidatePath("/")
      return {
        data: [input],
        error: null,
      }
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
      .where(eq(carts.id, cartId))

    revalidatePath("/")

    return {
      data: cart.items,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateCartItem(rawInput: z.infer<typeof cartItemSchema>) {
  noStore()

  try {
    const input = cartItemSchema.parse(rawInput)

    const cartId = cookies().get("cartId")?.value

    if (!cartId) {
      throw new Error("cartId not found, please try again.")
    }

    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
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
      .where(eq(carts.id, cartId))

    revalidatePath("/")

    return {
      data: cart.items,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteCart() {
  noStore()

  try {
    const cartId = cookies().get("cartId")?.value

    if (!cartId) {
      throw new Error("cartId not found, please try again.")
    }

    await db.delete(carts).where(eq(carts.id, cartId))

    revalidatePath("/")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteCartItem(
  input: z.infer<typeof deleteCartItemSchema>
) {
  noStore()

  try {
    const cartId = cookies().get("cartId")?.value

    if (!cartId) {
      throw new Error("cartId not found, please try again.")
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
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteCartItems(
  input: z.infer<typeof deleteCartItemsSchema>
) {
  noStore()

  try {
    const cartId = cookies().get("cartId")?.value

    if (!cartId) {
      throw new Error("cartId not found, please try again.")
    }

    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
    })

    if (!cart) return

    cart.items =
      cart.items?.filter(
        (item) => !input.productIds.includes(item.productId)
      ) ?? []

    await db
      .update(carts)
      .set({
        items: cart.items,
      })
      .where(eq(carts.id, cartId))

    revalidatePath("/")

    return {
      data: cart.items,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
