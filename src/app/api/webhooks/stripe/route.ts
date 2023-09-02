import { headers } from "next/headers"
import { db } from "@/db"
import { addresses, carts, orders, payments, products } from "@/db/schema"
import { env } from "@/env.mjs"
import type { CheckoutItem } from "@/types"
import { clerkClient } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import type Stripe from "stripe"
import { z } from "zod"

import { stripe } from "@/lib/stripe"
import { userPrivateMetadataSchema } from "@/lib/validations/auth"
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

  // Handling payment events
  // switch (event.type) {
  //   case "payment_intent.succeeded":
  //     const stripeObject = event.data.object as Stripe.PaymentIntent

  //     const paymentIntentId = stripeObject?.id
  //     const orderAmount = stripeObject?.amount
  //     const checkoutItems = stripeObject?.metadata
  //       ?.items as unknown as CheckoutItem[]

  //     try {
  //       // Parsing items from metadata, didn't parse before because can pass the unparsed data directly to the order table items json column in the db
  //       const safeParsedItems = z
  //         .array(checkoutItemSchema)
  //         .safeParse(JSON.parse(stripeObject?.metadata?.items ?? "[]"))

  //       if (!safeParsedItems.success) {
  //         throw new Error("Could not parse items.")
  //       }

  //       if (!event.account) throw new Error("No account found.")

  //       const payment = await db.query.payments.findFirst({
  //         columns: {
  //           storeId: true,
  //         },
  //         where: eq(payments.stripeAccountId, event.account),
  //       })

  //       if (!payment?.storeId) {
  //         return new Response("Store not found.", { status: 404 })
  //       }

  //       // Create new address in DB
  //       const stripeAddress = stripeObject?.shipping?.address

  //       const newAddress = await db.insert(addresses).values({
  //         line1: stripeAddress?.line1,
  //         line2: stripeAddress?.line2,
  //         city: stripeAddress?.city,
  //         state: stripeAddress?.state,
  //         country: stripeAddress?.country,
  //         postalCode: stripeAddress?.postal_code,
  //       })

  //       if (!newAddress.insertId) throw new Error("No address created.")

  //       // Create new order in db
  //       await db.insert(orders).values({
  //         storeId: payment.storeId,
  //         items: checkoutItems ?? [],
  //         amount: String(Number(orderAmount) / 100),
  //         stripePaymentIntentId: paymentIntentId,
  //         stripePaymentIntentStatus: stripeObject?.status,
  //         name: stripeObject?.shipping?.name,
  //         email: stripeObject?.receipt_email,
  //         addressId: Number(newAddress.insertId),
  //       })

  //       // Update product inventory in db
  //       for (const item of safeParsedItems.data) {
  //         const product = await db.query.products.findFirst({
  //           columns: {
  //             id: true,
  //             inventory: true,
  //           },
  //           where: eq(products.id, item.productId),
  //         })

  //         if (!product) {
  //           throw new Error("Product not found.")
  //         }

  //         const inventory = product.inventory - item.quantity

  //         if (inventory < 0) {
  //           throw new Error("Product out of stock.")
  //         }

  //         await db
  //           .update(products)
  //           .set({
  //             inventory: product.inventory - item.quantity,
  //           })
  //           .where(eq(products.id, item.productId))
  //       }

  //       // Close cart and clear items
  //       await db
  //         .update(carts)
  //         .set({
  //           closed: true,
  //           items: [],
  //         })
  //         .where(eq(carts.paymentIntentId, paymentIntentId))
  //     } catch (err) {
  //       console.log("Error creating order.", err)
  //     }

  //     break

  //   case "payment_intent.payment_failed":
  //     const paymentIntent = event.data.object as Stripe.PaymentIntent
  //     console.log(
  //       `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
  //     )
  //     break
  //   case "payment_intent.processing":
  //     const paymentIntentProcessing = event.data.object as Stripe.PaymentIntent
  //     console.log(
  //       `❌ Payment processing: ${paymentIntentProcessing.last_payment_error?.message}`
  //     )
  //     break
  //   case "charge.succeeded": {
  //     const charge = event.data.object as Stripe.Charge
  //     console.log(`Charge id: ${charge.id}`)
  //     break
  //   }
  //   default: {
  //     console.warn(`Unhandled event type: ${event.type}`)
  //     break
  //   }
  // }

  // Handling subscription events
  const session = event.data.object as Stripe.Checkout.Session

  if (!session?.metadata?.userId) {
    return new Response(null, { status: 200 })
  }

  if (event.type === "checkout.session.completed") {
    // Retrieve the subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    // Unsubscribe the user from the previous plan if they are subscribed to another plan
    // TODO: Need to find an alternative for this. This is a bit hacky.
    const user = await clerkClient.users.getUser(session.metadata.userId)

    const stripeSubscriptionId =
      userPrivateMetadataSchema.shape.stripeSubscriptionId.parse(
        user.privateMetadata.stripeSubscriptionId
      )

    if (subscription.customer && stripeSubscriptionId) {
      await stripe.subscriptions.update(stripeSubscriptionId, {
        cancel_at_period_end: true,
      })
    }

    // Update the user stripe into in our database.
    // Since this is the initial subscription, we need to update
    // the subscription id and customer id.
    await clerkClient.users.updateUserMetadata(session?.metadata?.userId, {
      privateMetadata: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    })
  }

  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    // Update the price id and set the new period end
    await clerkClient.users.updateUserMetadata(subscription.id, {
      privateMetadata: {
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    })
  }

  return new Response(null, { status: 200 })
}
