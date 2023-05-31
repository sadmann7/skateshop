"use client"

import * as React from "react"
import type { FileWithPreview, UploadThingOutput } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { PRODUCT_CATEGORY } from "@prisma/client"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { useZact } from "zact/client"
import { type z } from "zod"

import { formatEnum, isArrayOfFile } from "@/lib/utils"
import { addProductSchema } from "@/lib/validations/product"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { addProductAction, checkProductAction } from "@/app/_actions/product"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

import { FileDialog } from "../file-dialog"

interface AddProductFormProps {
  storeId: string
}

type Inputs = z.infer<typeof addProductSchema>

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export function AddProductForm({ storeId }: AddProductFormProps) {
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  // zact
  const { mutate, error } = useZact(addProductAction)

  // uploadthing
  const { isUploading, startUpload } = useUploadThing({
    endpoint: "productImage",
  })

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(addProductSchema),
  })

  async function onSubmit(data: Inputs) {
    console.log(data)

    setIsLoading(true)

    // Check if product already exists in the store
    try {
      await checkProductAction(data.name)
    } catch (error) {
      error instanceof Error && toast.error(error.message)
    }

    // Upload images if data.images is an array of files
    const rawImages = isArrayOfFile(data.images)
      ? ((await startUpload(data.images)) as UploadThingOutput[])
      : []

    const images = isArrayOfFile(data.images)
      ? rawImages.map((image) => ({
          id: image.fileKey,
          name: image.fileKey.split("_")[1] ?? image.fileKey,
          url: image.fileUrl,
        }))
      : []

    await mutate({
      storeId,
      name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      quantity: data.quantity,
      inventory: data.inventory,
      images: images,
    })

    error
      ? toast.error(error.message)
      : toast.success("Product added successfully")

    setIsLoading(false)
    form.reset()
    setFiles(null)
  }

  return (
    <Form {...form}>
      <form
        className="mx-auto grid w-full max-w-xl gap-6"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  id="add-product-name"
                  type="text"
                  placeholder="Type product name here."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type product description here."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.values(PRODUCT_CATEGORY).map((option) => (
                          <SelectItem key={option} value={option}>
                            {formatEnum(option ?? "")}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Type product price here."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Type product quantity here."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inventory"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Inventory</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Type product inventory here."
                    value={field.value}
                    // convert to number
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(Number(value))
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormItem className="flex flex-col gap-1.5">
          <FormLabel>Images</FormLabel>
          <FileDialog
            setValue={form.setValue}
            name="images"
            maxFiles={3}
            maxSize={1024 * 1024 * 4}
            files={files}
            setFiles={setFiles}
            isUploading={isUploading}
            disabled={isLoading}
          />
          <FormMessage />
        </FormItem>
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
    </Form>
  )
}
