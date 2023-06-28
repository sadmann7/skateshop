"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { stores, type Store } from "@/db/schema"
import { type UserRole } from "@/types"
import { clerkClient } from "@clerk/nextjs"
import {
  asc,
  desc,
  eq,
  gt,
  lt,
  sql,
} from "drizzle-orm"
import type { z } from "zod"

import { slugify } from "@/lib/utils"
import type {
  getStoreSchema,
  getStoresSchema,
  storeSchema,
} from "@/lib/validations/store"

export async function getStoresAction(input: z.infer<typeof getStoresSchema>) {
  const [column, order] =
    (input.sort?.split(".") as [
      keyof Store | undefined,
      "asc" | "desc" | undefined
    ]) ?? []

  const { items, total } = await db.transaction(async (tx) => {
    const items = await tx
      .select()
      .from(stores)
      .limit(input.limit)
      .offset(input.offset)
      // .where(and(storeIds.length ? inArray(stores.id, storeIds) : undefined))
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
  const user = await clerkClient.users.getUser(input.userId)

  if (!user) {
    throw new Error("User not found.")
  }

  // If the user doesn't have a role, set it to user
  if (!user.privateMetadata.role) {
    await clerkClient.users.updateUser(input.userId, {
      privateMetadata: {
        ...user.privateMetadata,
        role: "user" satisfies UserRole,
      },
    })
  }

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
  if (typeof input.id !== "number") {
    throw new Error("Invalid input.")
  }

  const store = await db.query.stores.findFirst({
    where: gt(stores.id, input.id),
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
  if (typeof input.id !== "number") {
    throw new Error("Invalid input.")
  }

  const store = await db.query.stores.findFirst({
    where: lt(stores.id, input.id),
    orderBy: desc(stores.id),
  })

  if (!store) {
    throw new Error("store not found.")
  }

  return store.id
}