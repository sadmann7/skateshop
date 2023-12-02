"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { slugify } from "@/lib/utils"
import { storeSchema } from "@/lib/validations/store"

const extendedStoreSchema = storeSchema.extend({
  userId: z.string(),
})

export async function addStore(rawInput: z.infer<typeof extendedStoreSchema>) {
  const input = extendedStoreSchema.parse(rawInput)

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
