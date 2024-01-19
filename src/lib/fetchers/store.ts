"use server"

import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from "next/cache"
import { db } from "@/db"
import { products, stores, type Store } from "@/db/schema"
import { and, asc, desc, eq, isNull, not, sql } from "drizzle-orm"
import type { z } from "zod"

import { getStoresSchema } from "@/lib/validations/store"

export async function getFeaturedStores() {
  try {
    return await cache(
      async () => {
        return db
          .select({
            id: stores.id,
            name: stores.name,
            description: stores.description,
            stripeAccountId: stores.stripeAccountId,
          })
          .from(stores)
          .limit(4)
          .leftJoin(products, eq(products.storeId, stores.id))
          .groupBy(stores.id)
          .orderBy(desc(stores.active), desc(sql<number>`count(*)`))
      },
      ["featured-stores"],
      {
        revalidate: 3600,
        tags: ["featured-stores"],
      }
    )()
  } catch (err) {
    console.error(err)
    return []
  }
}

export type FeaturedStoresPromise = ReturnType<typeof getFeaturedStores>

export async function getUserStores(input: { userId: string }) {
  try {
    return await cache(
      async () => {
        return db
          .select({
            id: stores.id,
            name: stores.name,
            description: stores.description,
            stripeAccountId: stores.stripeAccountId,
          })
          .from(stores)
          .leftJoin(products, eq(products.storeId, stores.id))
          .groupBy(stores.id)
          .orderBy(desc(stores.stripeAccountId), desc(sql<number>`count(*)`))
          .where(eq(stores.userId, input.userId))
      },
      ["user-stores"],
      {
        revalidate: 3600,
        tags: ["user-stores"],
      }
    )()
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getStores(rawInput: z.infer<typeof getStoresSchema>) {
  noStore()
  try {
    const input = getStoresSchema.parse(rawInput)

    const limit = input.limit ?? 10
    const offset = input.offset ?? 0
    const [column, order] =
      (input.sort?.split(".") as [
        keyof Store | undefined,
        "asc" | "desc" | undefined,
      ]) ?? []
    const statuses = input.statuses?.split(".") ?? []

    const { data, count } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: stores.id,
          name: stores.name,
          description: stores.description,
          stripeAccountId: stores.stripeAccountId,
          productCount: sql<number>`count(*)`,
        })
        .from(stores)
        .limit(limit)
        .offset(offset)
        .leftJoin(products, eq(stores.id, products.storeId))
        .where(
          and(
            input.userId ? eq(stores.userId, input.userId) : undefined,
            statuses.includes("active") && !statuses.includes("inactive")
              ? not(isNull(stores.stripeAccountId))
              : undefined,
            statuses.includes("inactive") && !statuses.includes("active")
              ? isNull(stores.stripeAccountId)
              : undefined
          )
        )
        .groupBy(stores.id)
        .orderBy(
          input.sort === "stripeAccountId.asc"
            ? asc(stores.stripeAccountId)
            : input.sort === "stripeAccountId.desc"
              ? desc(stores.stripeAccountId)
              : input.sort === "productCount.asc"
                ? asc(sql<number>`count(*)`)
                : input.sort === "productCount.desc"
                  ? desc(sql<number>`count(*)`)
                  : column && column in stores
                    ? order === "asc"
                      ? asc(stores[column])
                      : desc(stores[column])
                    : desc(stores.createdAt)
        )

      const count = await tx
        .select({
          count: sql<number>`count(*)`,
        })
        .from(stores)
        .where(
          and(
            input.userId ? eq(stores.userId, input.userId) : undefined,
            statuses.includes("active") && !statuses.includes("inactive")
              ? not(isNull(stores.stripeAccountId))
              : undefined,
            statuses.includes("inactive") && !statuses.includes("active")
              ? isNull(stores.stripeAccountId)
              : undefined
          )
        )
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        count,
      }
    })

    const pageCount = Math.ceil(count / limit)

    return {
      data,
      pageCount,
    }
  } catch (err) {
    console.error(err)
    return {
      data: [],
      pageCount: 0,
    }
  }
}
