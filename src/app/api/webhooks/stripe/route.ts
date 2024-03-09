import { revalidateTag } from "next/cache"
import { headers } from "next/headers"
import { db } from "@/db"
import { addresses, carts, orders, payments, products } from "@/db/schema"
import { env } from "@/env.js"
import type { CheckoutItem } from "@/types"
import { clerkClient } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import type Stripe from "stripe"
import { z } from "zod"

import { stripe } from "@/lib/stripe"
import { checkoutItemSchema } from "@/lib/validations/cart"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") ?? ""

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown error."}`,
      { status: 400 }
    )
  }

  switch (event.type) {
    // Handling subscription events
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object

      // If there is a user id, and no cart id in the metadata, then this is a new subscription
      if (
        checkoutSessionCompleted?.metadata?.userId &&
        !checkoutSessionCompleted?.metadata?.cartId
      ) {
        // Retrieve the subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(
          checkoutSessionCompleted.subscription as string
        )

        // Update the user stripe into in our database.
        // Since this is the initial subscription, we need to update
        // the subscription id and customer id.
        await clerkClient.users.updateUserMetadata(
          checkoutSessionCompleted?.metadata?.userId,
          {
            privateMetadata: {
              stripeSubscriptionId: subscription.id,
              stripeCustomerId: subscription.customer as string,
              stripePriceId: subscription.items.data[0]?.price.id,
              stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
            },
          }
        )
      }
      break
    case "invoice.payment_succeeded":
      const invoicePaymentSucceeded = event.data.object

      // If there is a user id, and no cart id in the metadata, then this is a new subscription
      if (
        invoicePaymentSucceeded?.metadata?.userId &&
        !invoicePaymentSucceeded?.metadata?.cartId
      ) {
        // Retrieve the subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(
          invoicePaymentSucceeded.subscription as string
        )

        // Update the price id and set the new period end
        await clerkClient.users.updateUserMetadata(
          invoicePaymentSucceeded?.metadata?.userId,
          {
            privateMetadata: {
              stripePriceId: subscription.items.data[0]?.price.id,
              stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
            },
          }
        )
      }
      revalidateTag(`${invoicePaymentSucceeded?.metadata?.userId}-subscription`)
      break

    // Handling payment events
    case "payment_intent.payment_failed":
      const paymentIntentPaymentFailed = event.data.object
      console.log(
        `❌ Payment failed: ${paymentIntentPaymentFailed.last_payment_error?.message}`
      )
      break
    case "payment_intent.processing":
      const paymentIntentProcessing = event.data.object
      console.log(`⏳ Payment processing: ${paymentIntentProcessing.id}`)
      break
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object

      const paymentIntentId = paymentIntentSucceeded?.id
      const orderAmount = paymentIntentSucceeded?.amount
      const checkoutItems = paymentIntentSucceeded?.metadata
        ?.items as unknown as CheckoutItem[]

      // If there are items in metadata, then create order
      if (checkoutItems) {
        try {
          if (!event.account) throw new Error("No account found.")

          // Parsing items from metadata
          // Didn't parse before because can pass the unparsed data directly to the order table items json column in the db
          const safeParsedItems = z
            .array(checkoutItemSchema)
            .safeParse(
              JSON.parse(paymentIntentSucceeded?.metadata?.items ?? "[]")
            )

          if (!safeParsedItems.success) {
            throw new Error("Could not parse items.")
          }

          const payment = await db.query.payments.findFirst({
            columns: {
              storeId: true,
            },
            where: eq(payments.stripeAccountId, event.account),
          })

          if (!payment?.storeId) {
            return new Response("Store not found.", { status: 404 })
          }

          // Create new address in DB
          const stripeAddress = paymentIntentSucceeded?.shipping?.address

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
            .returning({
              insertedId: addresses.id,
            })

          if (!newAddress[0]?.insertedId) throw new Error("No address created.")

          // Create new order in db
          await db.insert(orders).values({
            storeId: payment.storeId,
            items: checkoutItems ?? [],
            quantity: safeParsedItems.data.reduce(
              (acc, item) => acc + item.quantity,
              0
            ),
            amount: String(Number(orderAmount) / 100),
            stripePaymentIntentId: paymentIntentId,
            stripePaymentIntentStatus: paymentIntentSucceeded?.status,
            name: paymentIntentSucceeded?.shipping?.name ?? "",
            email: paymentIntentSucceeded?.receipt_email ?? "",
            addressId: newAddress[0]?.insertedId,
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
              throw new Error("Product not found.")
            }

            const inventory = product.inventory - item.quantity

            if (inventory < 0) {
              throw new Error("Product out of stock.")
            }

            await db
              .update(products)
              .set({
                inventory: product.inventory - item.quantity,
              })
              .where(eq(products.id, item.productId))
          }

          // Close cart and clear items
          await db
            .update(carts)
            .set({
              closed: true,
              items: [],
            })
            .where(eq(carts.paymentIntentId, paymentIntentId))
        } catch (err) {
          console.log("Error creating order.", err)
        }
      }
      break
    case "application_fee.created":
      const applicationFeeCreated = event.data.object
      console.log(`Application fee id: ${applicationFeeCreated.id}`)
      break
    case "charge.succeeded":
      const chargeSucceeded = event.data.object
      console.log(`Charge id: ${chargeSucceeded.id}`)
      break
    default:
      console.warn(`Unhandled event type: ${event.type}`)
  }

  return new Response(null, { status: 200 })
}
