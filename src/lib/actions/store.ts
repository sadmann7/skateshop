"use server"

import {
  unstable_noStore as noStore,
  revalidatePath,
  revalidateTag,
} from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { and, eq, not } from "drizzle-orm"

import { getErrorMessage } from "@/lib/handle-error"
import { slugify } from "@/lib/utils"
import {
  updateStoreSchema,
  type CreateStoreSchema,
} from "@/lib/validations/store"

export async function createStore(
  input: CreateStoreSchema & { userId: string }
) {
  noStore()
  try {
    const newStore = await db
      .insert(stores)
      .values({
        name: input.name,
        description: input.description,
        userId: input.userId,
        slug: slugify(input.name),
      })
      .returning({
        id: stores.id,
        slug: stores.slug,
      })
      .then((res) => res[0])

    revalidateTag(`stores-${input.userId}`)

    return {
      data: newStore,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateStore(storeId: string, fd: FormData) {
  noStore()
  try {
    const input = updateStoreSchema.parse({
      name: fd.get("name"),
      description: fd.get("description"),
    })

    const storeWithSameName = await db.query.stores.findFirst({
      where: and(eq(stores.name, input.name), not(eq(stores.id, storeId))),
      columns: {
        id: true,
      },
    })

    if (storeWithSameName) {
      throw new Error("Store name already taken")
    }

    await db
      .update(stores)
      .set({
        name: input.name,
        description: input.description,
      })
      .where(eq(stores.id, storeId))

    revalidatePath(`/dashboard/stores/${storeId}`)

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteStore(storeId: string) {
  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
    columns: {
      id: true,
    },
  })

  if (!store) {
    throw new Error("Store not found")
  }

  await db.delete(stores).where(eq(stores.id, storeId))

  revalidatePath("/dashboard/stores")
  redirect("/dashboard/stores")
}
