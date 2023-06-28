"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { stores, type Store } from "@/db/schema"
import { and, asc, desc, eq, gt, lt, sql } from "drizzle-orm"
import { type z } from "zod"

import { slugify } from "@/lib/utils"
import type { getStoreSchema, storeSchema } from "@/lib/validations/store"

export async function getStoresAction(input: {
  limit?: number
  offset?: number
  sort?: `${keyof Store}.${"asc" | "desc"}`
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
      })
      .from(stores)
      .limit(limit)
      .offset(offset)
      .orderBy(
        column && column in stores
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

  const store = await db.query.stores.findFirst({
    where: and(eq(stores.userId, input.userId), gt(stores.id, input.id)),
    orderBy: asc(stores.id),
  })

  if (!store) {
    throw new Error("Store not found.")
  }

  return store.id
}

export async function getPreviousStoreIdAction(
  input: z.infer<typeof getStoreSchema>
) {
  if (typeof input.id !== "number" || typeof input.userId !== "string") {
    throw new Error("Invalid input.")
  }

  const store = await db.query.stores.findFirst({
    where: and(eq(stores.userId, input.userId), lt(stores.id, input.id)),
    orderBy: desc(stores.id),
  })

  if (!store) {
    throw new Error("Store not found.")
  }

  return store.id
}
