"use server"

import { revalidatePath } from "next/cache"
import type { z } from "zod"

import { prisma } from "@/lib/db"
import { type addStoreSchema } from "@/lib/validations/store"

export async function addStoreAction(
  input: z.infer<typeof addStoreSchema> & { userId: string }
) {
  const storeWithSameName = await prisma.store.findFirst({
    where: {
      name: input.name,
    },
  })

  if (storeWithSameName) {
    throw new Error("Store name already taken")
  }

  await prisma.store.create({
    data: {
      name: input.name,
      description: input.description,
      user: {
        connect: {
          id: input.userId,
        },
      },
    },
  })

  revalidatePath("/account/stores")
}
