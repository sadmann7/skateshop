"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { products, type Product } from "@/db/schema"
import type { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"

import { getSubcategories } from "@/config/products"
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
  getNextProductIdAction,
  getPreviousProductIdAction,
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

  // Set files from product
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
  const { isUploading, startUpload } = useUploadThing("productImage")

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: product.category,
      subcategory: product.subcategory,
    },
  })

  // Get subcategories based on category
  const subcategories = getSubcategories(form.watch("category"))

  function onSubmit(data: Inputs) {
    console.log(data)

    startTransition(async () => {
      try {
        // Check if product already exists in the store
        await checkProductAction({
          name: data.name,
          id: product.id,
        })

        // Upload images if data.images is an array of files
        const images = isArrayOfFile(data.images)
          ? await startUpload(data.images).then((res) => {
              const formattedImages = res?.map((image) => ({
                id: image.fileKey,
                name: image.fileKey.split("_")[1] ?? image.fileKey,
                url: image.fileUrl,
              }))
              return formattedImages ?? null
            })
          : null

        // Update product
        await updateProductAction({
          ...data,
          storeId: product.storeId,
          id: product.id,
          images: images,
        })

        toast.success("Product updated successfully")
        setFiles(null)
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
        <div className="flex items-center justify-between space-x-2">
          <CardTitle className="text-2xl">Update product</CardTitle>
          <div className="flex space-x-0.5">
            <Button
              variant="ghost"
              size="sm"
              className="w-9 px-0"
              onClick={() => {
                startTransition(async () => {
                  try {
                    const prevProductId = await getPreviousProductIdAction({
                      id: product.id,
                      storeId: product.storeId,
                    })
                    router.push(
                      `/dashboard/stores/${product.storeId}/products/${prevProductId}`
                    )
                  } catch (error) {
                    error instanceof Error
                      ? toast.error(error.message)
                      : toast.error("Something went wrong")
                  }
                })
              }}
              disabled={isPending || isUploading}
            >
              <Icons.chevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Previous product</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-9 px-0"
              onClick={() => {
                startTransition(async () => {
                  try {
                    const nextProductId = await getNextProductIdAction({
                      id: product.id,
                      storeId: product.storeId,
                    })
                    router.push(
                      `/dashboard/stores/${product.storeId}/products/${nextProductId}`
                    )
                  } catch (error) {
                    error instanceof Error
                      ? toast.error(error.message)
                      : toast.error("Something went wrong")
                  }
                })
              }}
              disabled={isPending || isUploading}
            >
              <Icons.chevronRight className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Next product</span>
            </Button>
          </div>
        </div>
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
                        onValueChange={(value: typeof field.value) =>
                          field.onChange(value)
                        }
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
                                  {option}
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
              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Subcategory</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.toString()}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder={field.value} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {subcategories.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
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
            </div>
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Type product price here."
                    {...form.register("price")}
                    defaultValue={product.price}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.price?.message}
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
            <FormItem className="flex w-full flex-col gap-1.5">
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
                    await deleteProductAction({
                      storeId: product.storeId,
                      id: product.id,
                    })
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
