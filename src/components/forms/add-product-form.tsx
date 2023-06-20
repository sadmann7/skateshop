"use client"

import * as React from "react"
import { products } from "@/db/schema"
import type { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"

import { isArrayOfFile } from "@/lib/utils"
import { productSchema } from "@/lib/validations/product"
import { useSubcategories } from "@/hooks/use-subcategories"
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
import { MultiSelect } from "@/components/multi-select"
import { addProductAction, checkProductAction } from "@/app/_actions/product"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

interface AddProductFormProps {
  storeId: number
}

type Inputs = z.infer<typeof productSchema>

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export function AddProductForm({ storeId }: AddProductFormProps) {
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
  const [selectedSubcategories, setSelectedSubcategories] = React.useState<
    string[] | null
  >(null)
  const [isPending, startTransition] = React.useTransition()

  // uploadthing
  const { isUploading, startUpload } = useUploadThing({
    endpoint: "productImage",
  })

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: "skateboards",
    },
  })

  // Update subcategories when category changes
  const subcategories = useSubcategories(form.watch("category"))

  function onSubmit(data: Inputs) {
    console.log(data)

    startTransition(async () => {
      try {
        // Check if product already exists in the store
        await checkProductAction({
          name: data.name,
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

        // Add product to the store
        await addProductAction({
          ...data,
          storeId,
          images,
        })

        toast.success("Product added successfully.")

        // Reset form and files
        form.reset()
        setFiles(null)
        setSelectedSubcategories([])
      } catch (error) {
        error instanceof Error
          ? toast.error(error.message)
          : toast.error("Something went wrong.")
      }
    })
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Add product</CardTitle>
        <CardDescription>Add a new product to your store</CardDescription>
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
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedSubcategories(null)
                        }}
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
                name="subcategories"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Subcategories</FormLabel>
                    <FormControl>
                      <MultiSelect
                        selected={selectedSubcategories}
                        setSelected={setSelectedSubcategories}
                        onChange={field.onChange}
                        placeholder="Select subcategories"
                        options={subcategories}
                      />
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
                    {...form.register("price", {
                      valueAsNumber: true,
                    })}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.price?.message}
                />
              </FormItem>
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
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.quantity?.message}
                />
              </FormItem>
            </div>
            <div className="flex flex-col items-start gap-6 sm:flex-row">
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
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.inventory?.message}
                />
              </FormItem>
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
            </div>
            <Button className="w-fit" disabled={isPending}>
              {isPending && (
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
      </CardContent>
    </Card>
  )
}
