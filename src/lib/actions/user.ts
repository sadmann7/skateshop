import "server-only"

import { cache } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { products, stores } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { count, countDistinct, eq } from "drizzle-orm"

import { getSubscriptionPlan } from "@/lib/actions/stripe"
import { getPlanLimits } from "@/lib/subscription"

/**
 * Cache is used with a data-fetching function like fetch to share a data snapshot between components.
 * It ensures a single request is made for multiple identical data fetches, with the returned data cached and shared across components during the server render.
 * @see https://react.dev/reference/react/cache#reference
 */
export const getCacheduser = cache(async () => {
  noStore()
  try {
    return await currentUser()
  } catch (err) {
    console.error(err)
    return null
  }
})

export async function getUsage(input: { userId: string }) {
  noStore()
  try {
    const data = await db
      .select({
        storeCount: countDistinct(stores.id),
        productCount: count(products.id),
      })
      .from(stores)
      .leftJoin(products, eq(stores.id, products.storeId))
      .where(eq(stores.userId, input.userId))
      .groupBy(stores.userId)
      .execute()
      .then((res) => res[0])

    return {
      storeCount: data?.storeCount ?? 0,
      productCount: data?.productCount ?? 0,
    }
  } catch (err) {
    return {
      storeCount: 0,
      productCount: 0,
    }
  }
}

export async function getProgress(input: { userId: string }) {
  noStore()

  const fallback = {
    storeCount: 0,
    storeLimit: 0,
    productCount: 0,
    productLimit: 0,
    subscriptionPlan: null,
  }

  try {
    const subscriptionPlan = await getSubscriptionPlan({ userId: input.userId })

    if (!subscriptionPlan) {
      return fallback
    }

    const { storeCount, productCount } = await getUsage({
      userId: input.userId,
    })

    const { storeLimit, productLimit } = getPlanLimits({
      planTitle: subscriptionPlan.title,
    })

    return {
      storeCount,
      storeLimit,
      productCount,
      productLimit,
      subscriptionPlan,
    }
  } catch (err) {
    return fallback
  }
}
