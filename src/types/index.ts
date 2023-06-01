import { type products } from "@/db/schema"
import type { LucideIcon } from "lucide-react"
import type { FileWithPath } from "react-dropzone"

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: LucideIcon
  label?: string
}

export type FileWithPreview = FileWithPath & {
  preview: string
}

export type UploadedFile = {
  id: string
  name: string
  url: string
}

export type ProductsByCategory<TData extends object> = {
  category: (typeof products.category.enumValues)[number]
  products: TData[]
}
