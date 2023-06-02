"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { clerkClient } from "@clerk/nextjs"
import { and, eq, not } from "drizzle-orm"
import type { z } from "zod"

import { slugify } from "@/lib/utils"
import { type addStoreSchema } from "@/lib/validations/store"

export async function addStoreAction(
  input: z.infer<typeof addStoreSchema> & { userId: string }
) {
  const user = await clerkClient.users.getUser(input.userId)

  if (!user) {
    throw new Error("User not found")
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
    throw new Error("Store name already taken")
  }

  await db.insert(stores).values({
    name: input.name,
    description: input.description,
    userId: input.userId,
    slug: slugify(input.name),
  })

  revalidatePath("/dashboard")
}

export async function updateStoreAction(fd: FormData, storeId: number) {
  "use server"

  const name = fd.get("name") as string
  const description = fd.get("description") as string

  const storeWithSameName = await db
    .select()
    .from(stores)
    .where(and(eq(stores.name, name), not(eq(stores.id, storeId))))

  if (storeWithSameName) {
    throw new Error("Store name already taken")
  }

  await db
    .update(stores)
    .set({ name, description })
    .where(eq(stores.id, storeId))

  revalidatePath(`/dashboard/stores/${storeId}`)
}

export async function deleteStoreAction(storeId: number) {
  "use server"

  const store = await db.select().from(stores).where(eq(stores.id, storeId))

  if (!store) {
    throw new Error("Store not found")
  }

  await db.delete(stores).where(eq(stores.id, storeId))

  const path = "/dashboard"
  revalidatePath(path)
  redirect(path)
}
