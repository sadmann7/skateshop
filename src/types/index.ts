import type { PRODUCT_CATEGORY } from "@prisma/client"
import type { LucideIcon } from "lucide-react"
import type { FileWithPath } from "react-dropzone"

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: LucideIcon
}

export type SessionUser = {
  id: string
} & {
  name?: string | null
  email?: string | null
  image?: string | null
}

export type FileWithPreview = FileWithPath & {
  preview: string
}

export type UploadThingOutput = {
  fileKey: string
  fileUrl: string
}

export type ProductsByCategory<TData extends object> = {
  category: PRODUCT_CATEGORY
  products: TData[]
}

export type SortDirection = "asc" | "desc"
