"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { products, type Product } from "@/db/schema"
import type { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { type z } from "zod"

import { isArrayOfFile } from "@/lib/utils"
import { productSchema } from "@/lib/validations/product"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
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
import { FileDialog } from "@/components/file-dialog"
import { Icons } from "@/components/icons"
import {
  checkProductAction,
  deleteProductAction,
  updateProductAction,
} from "@/app/_actions/product"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

interface UpdateProductFormProps {
  product: Product
}

type Inputs = z.infer<typeof productSchema>

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export function UpdateProductForm({ product }: UpdateProductFormProps) {
  const router = useRouter()
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
  const [isPending, startTransition] = React.useTransition()

  React.useEffect(() => {
    if (product.images && product.images.length > 0) {
      setFiles(
        product.images.map((image) => {
          const file = new File([], image.name, {
            type: "image",
          })
          const fileWithPreview = Object.assign(file, {
            preview: image.url,
          })

          return fileWithPreview
        })
      )
    }
  }, [product])

  // uploadthing
  const { isUploading, startUpload } = useUploadThing({
    endpoint: "productImage",
  })

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: "skateboard",
    },
  })

  function onSubmit(data: Inputs) {
    console.log(data)

    startTransition(async () => {
      try {
        // Check if product already exists in the store
        await checkProductAction(data.name, product.id)

        // Upload images if data.images is an array of files
        const rawImages = isArrayOfFile(data.images)
          ? await toast.promise(startUpload(data.images), {
              loading: "Uploading images...",
              success: "Images uploaded successfully",
              error: "Failed to upload images",
            })
          : []

        const images = isArrayOfFile(data.images)
          ? rawImages?.map((image) => ({
              id: image.fileKey,
              name: image.fileKey.split("_")[1] ?? image.fileKey,
              url: image.fileUrl,
            }))
          : []

        // Add product to the store
        await updateProductAction({
          ...data,
          id: product.id,
          images: images ?? product.images,
        })

        toast.success("Product added successfully")
      } catch (error) {
        error instanceof Error
          ? toast.error(error.message)
          : toast.error("Something went wrong")
      }
    })
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Update product</CardTitle>
        <CardDescription>
          Update your product information, or delete it
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="grid w-full max-w-2xl gap-5"
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  aria-invalid={!!form.formState.errors.name}
                  placeholder="Type product name here."
                  {...form.register("name")}
                  defaultValue={product.name}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.name?.message}
              />
            </FormItem>
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type product description here."
                  {...form.register("description")}
                  defaultValue={product.description ?? ""}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.description?.message}
              />
            </FormItem>
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={product.category}
                      >
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder={field.value} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(products.category.enumValues).map(
                              (option) => (
                                <SelectItem
                                  key={option}
                                  value={option}
                                  className="capitalize"
                                >
                                  {option ?? ""}
                                </SelectItem>
                              )
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Type product price here."
                    {...form.register("price", {
                      valueAsNumber: true,
                    })}
                    defaultValue={product.price}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.price?.message}
                />
              </FormItem>
            </div>
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <FormItem className="w-full">
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Type product quantity here."
                    {...form.register("quantity", {
                      valueAsNumber: true,
                    })}
                    defaultValue={product.quantity}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.quantity?.message}
                />
              </FormItem>
              <FormItem className="w-full">
                <FormLabel>Inventory</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Type product inventory here."
                    {...form.register("inventory", {
                      valueAsNumber: true,
                    })}
                    defaultValue={product.inventory}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.inventory?.message}
                />
              </FormItem>
            </div>
            <FormItem className="flex flex-col gap-1.5">
              <FormLabel>Images</FormLabel>
              <FormControl>
                <FileDialog
                  setValue={form.setValue}
                  name="images"
                  maxFiles={3}
                  maxSize={1024 * 1024 * 4}
                  files={files}
                  setFiles={setFiles}
                  isUploading={isUploading}
                  disabled={isPending}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.images?.message}
              />
            </FormItem>
            <div className="flex space-x-2">
              <Button disabled={isPending}>
                {isPending && (
                  <Icons.spinner
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Update Product
                <span className="sr-only">Update product</span>
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  startTransition(async () => {
                    await deleteProductAction(product.id)
                    router.push(`/dashboard/stores/${product.storeId}/products`)
                  })
                }}
                disabled={isPending}
              >
                {isPending && (
                  <Icons.spinner
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Delete Product
                <span className="sr-only">Delete product</span>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
