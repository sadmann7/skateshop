"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { stores, type Store } from "@/db/schema"
import { clerkClient } from "@clerk/nextjs"
import { asc, desc, eq } from "drizzle-orm"
import type { z } from "zod"

import { slugify } from "@/lib/utils"
import { type storeSchema } from "@/lib/validations/store"

export async function getStoresAction(input: {
  sort?: `${keyof Store}-${"asc" | "desc"}`
}) {
  const [column, order] =
    (input.sort?.split("-") as [
      keyof Store | undefined,
      "asc" | "desc" | undefined
    ]) ?? []

  const allStores = await db
    .select({
      id: stores.id,
      name: stores.name,
    })
    .from(stores)
    .orderBy(
      column && column in stores
        ? order === "asc"
          ? asc(stores[column])
          : desc(stores[column])
        : desc(stores.createdAt)
    )

  return allStores
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
        role: "user",
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
