"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { products, stores, type Store } from "@/db/schema"
import { and, asc, desc, eq, gt, lt, sql } from "drizzle-orm"
import { type z } from "zod"

import { slugify } from "@/lib/utils"
import type { getStoreSchema, storeSchema } from "@/lib/validations/store"

export async function getStoresAction(input: {
  limit?: number
  offset?: number
  sort?: `${keyof Store | "productCount"}.${"asc" | "desc"}`
}) {
  const limit = input.limit ?? 10
  const offset = input.offset ?? 0
  const [column, order] =
    (input.sort?.split("-") as [
      keyof Store | undefined,
      "asc" | "desc" | undefined
    ]) ?? []

  const { items, total } = await db.transaction(async (tx) => {
    const items = await tx
      .select({
        id: stores.id,
        name: stores.name,
        productCount: sql<number>`count(${products.id})`,
      })
      .from(stores)
      .limit(limit)
      .offset(offset)
      .leftJoin(products, eq(stores.id, products.storeId))
      .groupBy(stores.id)
      .orderBy(
        input.sort === "productCount.asc"
          ? asc(sql<number>`count(${products.id})`)
          : input.sort === "productCount.desc"
          ? desc(sql<number>`count(${products.id})`)
          : column && column in stores
          ? order === "asc"
            ? asc(stores[column])
            : desc(stores[column])
          : desc(stores.createdAt)
      )

    const total = await tx
      .select({
        count: sql<number>`count(${stores.id})`,
      })
      .from(stores)

    return {
      items,
      total: Number(total[0]?.count) ?? 0,
    }
  })

  return {
    items,
    total,
  }
}

export async function addStoreAction(
  input: z.infer<typeof storeSchema> & { userId: string }
) {
  const storeWithSameName = await db.query.stores.findFirst({
    where: eq(stores.name, input.name),
  })

  if (storeWithSameName) {
    throw new Error("Store name already taken.")
  }

  await db.insert(stores).values({
    name: input.name,
    description: input.description,
    userId: input.userId,
    slug: slugify(input.name),
  })

  revalidatePath("/dashboard/stores")
}

export async function getNextStoreIdAction(
  input: z.infer<typeof getStoreSchema>
) {
  if (typeof input.id !== "number" || typeof input.userId !== "string") {
    throw new Error("Invalid input.")
  }

  const nextStore = await db.query.stores.findFirst({
    where: and(eq(stores.userId, input.userId), gt(stores.id, input.id)),
    orderBy: asc(stores.id),
  })

  if (!nextStore) {
    const firstStore = await db.query.stores.findFirst({
      where: eq(stores.userId, input.userId),
      orderBy: asc(stores.id),
    })

    if (!firstStore) {
      throw new Error("Store not found.")
    }

    return firstStore.id
  }

  return nextStore.id
}

export async function getPreviousStoreIdAction(
  input: z.infer<typeof getStoreSchema>
) {
  if (typeof input.id !== "number" || typeof input.userId !== "string") {
    throw new Error("Invalid input.")
  }

  const previousStore = await db.query.stores.findFirst({
    where: and(eq(stores.userId, input.userId), lt(stores.id, input.id)),
    orderBy: desc(stores.id),
  })

  if (!previousStore) {
    const lastStore = await db.query.stores.findFirst({
      where: eq(stores.userId, input.userId),
      orderBy: desc(stores.id),
    })

    if (!lastStore) {
      throw new Error("Store not found.")
    }

    return lastStore.id
  }

  return previousStore.id
}
