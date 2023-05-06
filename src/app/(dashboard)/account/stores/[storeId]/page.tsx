import type { Metadata } from "next"
import { revalidatePath, revalidateTag } from "next/cache"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { prisma } from "@/lib/db"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingButton } from "@/components/ui/loading-button"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/header"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  title: "Manage Store",
  description: "Manage your store.",
}

interface EditStorePageProps {
  params: {
    storeId: string
  }
}

export default async function EditStorePage({ params }: EditStorePageProps) {
  const { storeId } = params

  async function updateStore(fd: FormData) {
    "use server"

    const name = fd.get("name") as string
    const description = fd.get("description") as string

    await prisma.store.update({
      where: {
        id: storeId,
      },
      data: {
        name,
        description,
      },
    })

    const tag = `store:${storeId}`
    revalidateTag(tag)
  }

  async function deleteStore() {
    "use server"

    await prisma.store.delete({
      where: {
        id: storeId,
      },
    })

    const path = "/account/stores"
    revalidatePath(path)
    redirect(path)
  }

  const store = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  })

  if (!store) {
    notFound()
  }

  return (
    <section className="container grid w-full items-center gap-10 pb-10 pt-6 md:py-10">
      <Header
        title={store.name}
        description={
          store.description?.length ? store.description : "Manage your store."
        }
      />
      <div className="flex flex-col items-center gap-2.5 sm:flex-row">
        <Link href={`/account/stores/${storeId}`} className="w-full sm:w-fit">
          <div
            className={cn(
              buttonVariants({
                size: "sm",
                variant: "secondary",
              }),
              "w-full sm:w-auto"
            )}
          >
            <Icons.store className="mr-2 h-4 w-4" />
            Manage Store
            <span className="sr-only">Manage Store</span>
          </div>
        </Link>
        <Link
          href={`/account/stores/${storeId}/products`}
          className="w-full sm:w-fit"
        >
          <div
            className={cn(
              buttonVariants({
                size: "sm",
                variant: "outline",
              }),
              "w-full sm:w-auto"
            )}
          >
            <Icons.product className="mr-2 h-4 w-4" />
            Manage Products
            <span className="sr-only">Manage Products</span>
          </div>
        </Link>
      </div>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form action={updateStore} className="mx-auto grid w-full max-w-xl gap-5">
        <fieldset className="grid gap-2.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            name="name"
            required
            minLength={3}
            maxLength={50}
            placeholder="Type store name here."
            defaultValue={store.name}
          />
        </fieldset>
        <fieldset className="grid gap-2.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            minLength={3}
            maxLength={255}
            placeholder="Type store description here."
            defaultValue={store.description ?? ""}
          />
        </fieldset>
        <LoadingButton>Update Store</LoadingButton>
        <LoadingButton
          variant="destructive"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          formAction={deleteStore}
        >
          Delete Store
        </LoadingButton>
      </form>
    </section>
  )
}
