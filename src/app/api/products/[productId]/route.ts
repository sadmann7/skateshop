import type { NextRequest } from "next/server"
import type { UploadThingOutput } from "@/types"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { addProductSchema } from "@/lib/validations/product"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export async function PATCH(req: NextRequest) {
  const { startUpload } = useUploadThing({
    endpoint: "productImage",
  })

  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized.", { status: 403 })
    }

    const input = z
      .object({
        ...addProductSchema.shape,
        storeId: z.string(),
      })
      .parse(await req.json())

    const productWithSameName = await prisma.product.findFirst({
      where: {
        name: input.name,
      },
    })

    if (productWithSameName) {
      throw new Error("Product name already taken")
    }

    const rawImages = (await startUpload(
      input.images as File[]
    )) as UploadThingOutput[]

    const images = rawImages.map((image) => ({
      id: image.fileKey,
      name: image.fileKey.split("_")[1] ?? image.fileKey,
      url: image.fileUrl,
    }))

    await prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        category: input.category,
        price: input.price,
        quantity: input.quantity,
        inventory: input.inventory,
        images: {
          createMany: {
            data: images,
          },
        },
        store: {
          connect: {
            id: input.storeId,
          },
        },
      },
    })

    return new Response(
      JSON.stringify({
        message: "Product created successfully",
      }),
      { status: 200 }
    )
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    } else if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    } else {
      return new Response(null, { status: 500 })
    }
  }
}
