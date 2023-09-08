"use server"

import { cookies } from "next/headers"
import { db } from "@/db"
import { addresses, carts, orders, payments, products } from "@/db/schema"
import type { CartLineItem, CheckoutItem } from "@/types"
import { desc, eq, inArray } from "drizzle-orm"
import type Stripe from "stripe"
import { z } from "zod"

import { checkoutItemSchema } from "@/lib/validations/cart"
import type { getOrderLineItemsSchema } from "@/lib/validations/order"

export async function getOrderLineItemsAction(
  input: z.infer<typeof getOrderLineItemsSchema> & {
    paymentIntent?: Stripe.Response<Stripe.PaymentIntent> | null
  }
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

    // Temporary workaround for payment_intent.succeeded webhook event not firing in production
    // TODO: Remove this once the webhook is working
    if (input.paymentIntent?.status === "succeeded") {
      const cartId = Number(cookies().get("cartId")?.value)

      const cart = await db.query.carts.findFirst({
        columns: {
          closed: true,
          paymentIntentId: true,
          clientSecret: true,
        },
        where: eq(carts.id, cartId),
      })

      if (!cart || cart.closed) {
        return lineItems
      }

      if (!cart.clientSecret || !cart.paymentIntentId) {
        return lineItems
      }

      const payment = await db.query.payments.findFirst({
        columns: {
          storeId: true,
          stripeAccountId: true,
        },
        where: eq(payments.storeId, input.storeId),
      })

      if (!payment?.stripeAccountId) {
        return lineItems
      }

      // Create new address in DB
      const stripeAddress = input.paymentIntent.shipping?.address

      const newAddress = await db.insert(addresses).values({
        line1: stripeAddress?.line1,
        line2: stripeAddress?.line2,
        city: stripeAddress?.city,
        state: stripeAddress?.state,
        country: stripeAddress?.country,
        postalCode: stripeAddress?.postal_code,
      })

      if (!newAddress.insertId) throw new Error("No address created.")

      // Create new order in db
      await db.insert(orders).values({
        storeId: payment.storeId,
        items: input.items as unknown as CheckoutItem[],
        quantity: safeParsedItems.data.reduce(
          (acc, item) => acc + item.quantity,
          0
        ),
        amount: String(Number(input.paymentIntent.amount) / 100),
        stripePaymentIntentId: input.paymentIntent.id,
        stripePaymentIntentStatus: input.paymentIntent.status,
        name: input.paymentIntent.shipping?.name,
        email: input.paymentIntent.receipt_email,
        addressId: Number(newAddress.insertId),
      })

      // Update product inventory in db
      for (const item of safeParsedItems.data) {
        const product = await db.query.products.findFirst({
          columns: {
            id: true,
            inventory: true,
          },
          where: eq(products.id, item.productId),
        })

        if (!product) {
          return lineItems
        }

        const inventory = product.inventory - item.quantity

        if (inventory < 0) {
          return lineItems
        }

        await db
          .update(products)
          .set({
            inventory: product.inventory - item.quantity,
          })
          .where(eq(products.id, item.productId))
      }

      await db
        .update(carts)
        .set({
          closed: true,
          items: [],
        })
        .where(eq(carts.paymentIntentId, cart.paymentIntentId))
    }

    return lineItems
  } catch (err) {
    console.error(err)
    return []
  }
}
