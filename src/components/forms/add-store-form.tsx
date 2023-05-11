"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useZact } from "zact/client"
import type { z } from "zod"

import { addStoreAction } from "@/lib/actions/store"
import { addStoreSchema } from "@/lib/validations/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

interface AddStoreFormProps {
  userId: string
}

type Inputs = z.infer<typeof addStoreSchema>

export function AddStoreForm({ userId }: AddStoreFormProps) {
  const router = useRouter()

  // zact for handling sever actions
  const { mutate, isLoading } = useZact(addStoreAction)

  // react-hook-form
  const { register, handleSubmit, formState, reset } = useForm<Inputs>({
    resolver: zodResolver(addStoreSchema),
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    reset()
    await mutate({
      ...data,
      userId,
    })

    router.push("/account/stores")
    router.refresh()
  }

  return (
    <form
      className="mx-auto grid w-full max-w-xl gap-5"
      onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
    >
      <fieldset className="grid gap-2.5">
        <Label htmlFor="add-store-name">Name</Label>
        <Input
          id="add-store-name"
          type="text"
          placeholder="Type store name here."
          {...register("name", { required: true })}
        />
        {formState.errors.name && (
          <p className="text-sm text-red-500">
            {formState.errors.name.message}
          </p>
        )}
      </fieldset>
      <fieldset className="grid gap-2.5">
        <Label htmlFor="add-store-description">Description</Label>
        <Textarea
          id="add-store-description"
          placeholder="Type store description here."
          {...register("description")}
        />
        {formState.errors.description && (
          <p className="text-sm text-red-500">
            {formState.errors.description.message}
          </p>
        )}
      </fieldset>
      <Button disabled={isLoading}>
        {isLoading && (
          <Icons.spinner
            className="mr-2 h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        )}
        Add Store
        <span className="sr-only">Add Store</span>
      </Button>
    </form>
  )
}
