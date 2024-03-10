import "server-only"

import { cache } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { products, stores } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { count, eq } from "drizzle-orm"

import { getPlanLimits } from "../subscription"
import { getSubscriptionPlan } from "./stripe"

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
        storeCount: count(stores.id),
        productCount: count(products.id),
      })
      .from(stores)
      .leftJoin(products, eq(products.storeId, stores.id))
      .where(eq(stores.userId, input.userId))
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
    storeLimit: 0,
    storeProgress: 0,
    productLimit: 0,
    productProgress: 0,
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

    const storeProgress = Math.floor((storeCount / storeLimit) * 100)
    const productProgress = Math.floor((productCount / productLimit) * 100)

    return {
      storeLimit,
      storeProgress,
      productLimit,
      productProgress,
      subscriptionPlan,
    }
  } catch (err) {
    return fallback
  }
}
