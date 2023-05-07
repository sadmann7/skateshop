"use server"

import { revalidatePath } from "next/cache"
import { zact } from "zact/server"
import { z } from "zod"

import { prisma } from "@/lib/db"
import { addStoreSchema } from "@/lib/validations/store"

export const addStoreAction = zact(
  z.object({
    ...addStoreSchema.shape,
    userId: z.string(),
  })
)(async (input) => {
  const storeWithSameName = await prisma.store.findFirst({
    where: {
      name: input.name,
    },
  })

  if (storeWithSameName) {
    throw new Error("A store with the same name already exists.")
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

  const path = "/account/stores"
  revalidatePath(path)
})
