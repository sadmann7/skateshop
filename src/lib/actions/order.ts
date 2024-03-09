"use server"

import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { db } from "@/db"
import {
  addresses,
  carts,
  categories,
  orders,
  payments,
  products,
  subcategories,
  type Order,
} from "@/db/schema"
import type { CartLineItem, CheckoutItem, SearchParams } from "@/types"
import { and, asc, desc, eq, gte, inArray, like, lte, sql } from "drizzle-orm"
import type Stripe from "stripe"
import { z } from "zod"

import { checkoutItemSchema } from "@/lib/validations/cart"
import type { getOrderLineItemsSchema } from "@/lib/validations/order"
import { ordersSearchParamsSchema } from "@/lib/validations/params"

export async function getOrderLineItems(
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
        price: products.price,
        inventory: products.inventory,
        storeId: products.storeId,
        categoryId: products.categoryId,
        subcategoryId: products.subcategoryId,
      })
      .from(products)
      .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
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
      const cartId = String(cookies().get("cartId")?.value)

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

      const newAddress = await db
        .insert(addresses)
        .values({
          line1: stripeAddress?.line1,
          line2: stripeAddress?.line2,
          city: stripeAddress?.city,
          state: stripeAddress?.state,
          country: stripeAddress?.country,
          postalCode: stripeAddress?.postal_code,
        })
        .returning({ insertedId: addresses.id })

      if (!newAddress[0]?.insertedId) throw new Error("No address created.")

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
        name: input.paymentIntent.shipping?.name ?? "",
        email: input.paymentIntent.receipt_email ?? "",
        addressId: newAddress[0].insertedId,
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
    return []
  }
}

export async function getStoreOrders(input: {
  storeId: string
  searchParams: SearchParams
}) {
  noStore()
  try {
    const { page, per_page, sort, customer, status, from, to } =
      ordersSearchParamsSchema.parse(input.searchParams)

    // Fallback page for invalid page numbers
    const fallbackPage = isNaN(page) || page < 1 ? 1 : page
    // Number of items per page
    const limit = isNaN(per_page) ? 10 : per_page
    // Number of items to skip
    const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
    // Column and order to sort by
    const [column, order] = (sort.split(".") as [
      keyof Order | undefined,
      "asc" | "desc" | undefined,
    ]) ?? ["createdAt", "desc"]

    const statuses = status ? status.split(".") : []

    const fromDay = from ? new Date(from) : undefined
    const toDay = to ? new Date(to) : undefined

    // Transaction is used to ensure both queries are executed in a single transaction
    return await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: orders.id,
          storeId: orders.storeId,
          quantity: orders.quantity,
          amount: orders.amount,
          paymentIntentId: orders.stripePaymentIntentId,
          status: orders.stripePaymentIntentStatus,
          customer: orders.email,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .limit(limit)
        .offset(offset)
        .where(
          and(
            eq(orders.storeId, input.storeId),
            // Filter by email
            customer ? like(orders.email, `%${customer}%`) : undefined,
            // Filter by status
            statuses.length > 0
              ? inArray(orders.stripePaymentIntentStatus, statuses)
              : undefined,
            // Filter by createdAt
            fromDay && toDay
              ? and(
                  gte(orders.createdAt, fromDay),
                  lte(orders.createdAt, toDay)
                )
              : undefined
          )
        )
        .orderBy(
          column && column in orders
            ? order === "asc"
              ? asc(orders[column])
              : desc(orders[column])
            : desc(orders.createdAt)
        )

      const count = await tx
        .select({
          count: sql<number>`count(*)`,
        })
        .from(orders)
        .where(
          and(
            eq(orders.storeId, input.storeId),
            // Filter by email
            customer ? like(orders.email, `%${customer}%`) : undefined,
            // Filter by status
            statuses.length > 0
              ? inArray(orders.stripePaymentIntentStatus, statuses)
              : undefined,
            // Filter by createdAt
            fromDay && toDay
              ? and(
                  gte(orders.createdAt, fromDay),
                  lte(orders.createdAt, toDay)
                )
              : undefined
          )
        )
        .execute()
        .then((res) => res[0]?.count ?? 0)

      const pageCount = Math.ceil(count / limit)

      return {
        data,
        pageCount,
      }
    })
  } catch (err) {
    console.error(err)
    return {
      data: [],
      pageCount: 0,
    }
  }
}

export async function getOrderCount(input: {
  storeId: string
  fromDay?: Date
  toDay?: Date
}) {
  noStore()
  try {
    const { storeId, fromDay, toDay } = input

    return await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .where(
        and(
          eq(orders.storeId, storeId),
          fromDay && toDay
            ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
            : undefined
        )
      )
      .execute()
      .then((res) => res[0]?.count ?? 0)
  } catch (err) {
    return 0
  }
}

export async function getSaleCount(input: {
  storeId: string
  fromDay?: Date
  toDay?: Date
}) {
  noStore()
  try {
    const { storeId, fromDay, toDay } = input

    const storeOrders = await db
      .select({
        amount: orders.amount,
      })
      .from(orders)
      .where(
        and(
          eq(orders.storeId, storeId),
          fromDay && toDay
            ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
            : undefined
        )
      )

    const sales = storeOrders.reduce(
      (acc, order) => acc + Number(order.amount),
      0
    )

    return sales
  } catch (err) {
    return 0
  }
}

export async function getSales(input: {
  storeId: string
  fromDay?: Date
  toDay?: Date
}) {
  noStore()
  try {
    const { storeId, fromDay, toDay } = input

    return await db
      .select({
        year: sql`EXTRACT(YEAR FROM ${orders.createdAt})`.mapWith(Number),
        month: sql`EXTRACT(MONTH FROM ${orders.createdAt})`.mapWith(Number),
        totalSales: sql`SUM(${orders.amount})`.mapWith(Number),
      })
      .from(orders)
      .where(
        and(
          eq(orders.storeId, storeId),
          fromDay && toDay
            ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
            : undefined
        )
      )
      .groupBy(
        sql`EXTRACT(YEAR FROM ${orders.createdAt})`,
        sql`EXTRACT(MONTH FROM ${orders.createdAt})`
      )
      .orderBy(
        sql`EXTRACT(YEAR FROM ${orders.createdAt})`,
        sql`EXTRACT(MONTH FROM ${orders.createdAt})`
      )
      .execute()
  } catch (err) {
    return []
  }
}

export async function getCustomers(input: {
  storeId: string
  limit: number
  offset: number
  fromDay?: Date
  toDay?: Date
}) {
  noStore()
  try {
    const transaction = await db.transaction(async (tx) => {
      const { storeId, limit, offset, fromDay, toDay } = input

      const customers = await tx
        .select({
          email: orders.email,
          name: orders.name,
          totalSpent: sql<number>`sum(${orders.amount})`,
        })
        .from(orders)
        .limit(limit)
        .offset(offset)
        .where(
          and(
            eq(orders.storeId, storeId),
            fromDay && toDay
              ? and(
                  gte(orders.createdAt, fromDay),
                  lte(orders.createdAt, toDay)
                )
              : undefined
          )
        )
        .groupBy(orders.email, orders.name, orders.createdAt)
        .orderBy(desc(orders.createdAt))

      const customerCount = await tx
        .select({
          count: sql<number>`count(distinct ${orders.email})`,
        })
        .from(orders)
        .where(
          and(
            eq(orders.storeId, storeId),
            fromDay && toDay
              ? and(
                  gte(orders.createdAt, fromDay),
                  lte(orders.createdAt, toDay)
                )
              : undefined
          )
        )
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        customers,
        customerCount,
      }
    })

    return transaction
  } catch (err) {
    return {
      customers: [],
      customerCount: 0,
    }
  }
}
