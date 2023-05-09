"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { PRODUCT_CATEGORY } from "@prisma/client"
import { generateReactHelpers } from "@uploadthing/react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useZact } from "zact/client"
import { type z } from "zod"

import { addProductAction } from "@/lib/actions"
import { addProductSchema } from "@/lib/validations/product"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileDialog } from "@/components/file-dialog"
import { Icons } from "@/components/icons"
import { SelectInput } from "@/components/select-input"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

interface AddProductFormProps {
  storeId: string
}

type Inputs = z.infer<typeof addProductSchema>

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export function AddProductForm({ storeId }: AddProductFormProps) {
  // zact for handling sever actions
  const { mutate, isLoading } = useZact(addProductAction)

  // uploadthing
  const { getRootProps, getInputProps, isDragActive, files, startUpload } =
    useUploadThing("imageUploader")

  // react-hook-form
  const { register, handleSubmit, formState, control, setValue, reset } =
    useForm<Inputs>({
      resolver: zodResolver(addProductSchema),
    })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)

    // reset()
  }

  return (
    <form
      className="mx-auto grid w-full max-w-xl gap-6"
      onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
    >
      <fieldset className="grid gap-2.5">
        <Label htmlFor="add-product-name">Name</Label>
        <Input
          id="add-product-name"
          type="text"
          placeholder="Type product name here."
          {...register("name", { required: true })}
        />
        {formState.errors.name && (
          <p className="text-sm text-red-500 dark:text-red-500">
            {formState.errors.name.message}
          </p>
        )}
      </fieldset>
      <fieldset className="grid gap-2.5">
        <Label htmlFor="add-product-description">Description</Label>
        <Textarea
          id="add-product-description"
          placeholder="Type product description here."
          {...register("description")}
        />
        {formState.errors.description && (
          <p className="text-sm text-red-500 dark:text-red-500">
            {formState.errors.description.message}
          </p>
        )}
      </fieldset>
      <div className="flex flex-col items-start  gap-2.5 sm:flex-row">
        <fieldset className="grid w-full gap-2.5">
          <Label htmlFor="add-product-category">Category</Label>
          <SelectInput
            control={control}
            name="category"
            placeholder="Select a category."
            options={Object.values(PRODUCT_CATEGORY)}
          />
          {formState.errors.description && (
            <p className="text-sm text-red-500 dark:text-red-500">
              {formState.errors.description.message}
            </p>
          )}
        </fieldset>
        <fieldset className="grid w-full gap-2.5">
          <Label htmlFor="add-product-price">Price</Label>
          <Input
            id="add-product-price"
            type="number"
            placeholder="Type product price here."
            {...register("price", { required: true, valueAsNumber: true })}
          />
          {formState.errors.price && (
            <p className="text-sm text-red-500 dark:text-red-500">
              {formState.errors.price.message}
            </p>
          )}
        </fieldset>
      </div>
      <div className="flex flex-col items-start gap-2.5 sm:flex-row">
        <fieldset className="grid w-full gap-2.5">
          <Label htmlFor="add-product-quantity">Quantity</Label>
          <Input
            id="add-product-quantity"
            type="number"
            placeholder="Type product quantity here."
            {...register("quantity", { required: true, valueAsNumber: true })}
          />
          {formState.errors.quantity && (
            <p className="text-sm text-red-500 dark:text-red-500">
              {formState.errors.quantity.message}
            </p>
          )}
        </fieldset>
        <fieldset className="grid w-full gap-2.5">
          <Label htmlFor="add-product-inventory">Inventory</Label>
          <Input
            id="add-product-inventory"
            type="number"
            placeholder="Type product inventory here."
            {...register("inventory", { required: true, valueAsNumber: true })}
          />
          {formState.errors.inventory && (
            <p className="text-sm text-red-500 dark:text-red-500">
              {formState.errors.inventory.message}
            </p>
          )}
        </fieldset>
      </div>
      <fieldset className="grid gap-3">
        <Label htmlFor="add-product-images">Images (optional)</Label>
        <FileDialog
          maxFiles={3}
          maxSize={1024 * 1024 * 8}
          disabled={isLoading}
        />
        {formState.errors.image && (
          <p className="text-sm text-red-500 dark:text-red-500">
            {formState.errors.image.message}
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
        Add Product
        <span className="sr-only">Add Product</span>
      </Button>
    </form>
  )
}
