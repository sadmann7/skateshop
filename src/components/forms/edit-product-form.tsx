"use client"

import { products } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EditProductFormProps {
  productId: number
}

const schema = z.object({
  name: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  description: z.string().optional(),
  category: z.enum(products.category.enumValues),
  price: z.number().positive({
    message: "Must be a positive number",
  }),
  quantity: z.number().positive({
    message: "Must be a positive number",
  }),
  inventory: z.number().positive({
    message: "Must be a positive number",
  }),
  images: z.array(z.string()).optional(),
})
type Inputs = z.infer<typeof schema>

export function EditProductForm({ productId }: EditProductFormProps) {
  console.log(productId)

  // react-hook-form
  const { register, handleSubmit, formState, control, setValue, watch, reset } =
    useForm<Inputs>({
      resolver: zodResolver(schema),
    })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)

    // reset()
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Edit product</CardTitle>
        <CardDescription>Edit a product in your store</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form
          className="grid w-full max-w-xl gap-5"
          onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
        >
          <fieldset className="grid gap-2.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Name"
              {...register("name", { required: true })}
            />
            {formState.errors.name && (
              <p className="text-sm text-red-500 dark:text-red-500">
                {formState.errors.name.message}
              </p>
            )}
          </fieldset>
          <Button className="w-fit">Save</Button>
        </form>
      </CardContent>
    </Card>
  )
}
