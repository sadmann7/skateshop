import { type products } from "@/db/schema"
import type { FileWithPath } from "react-dropzone"

import { type Icons } from "@/components/icons"

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export type MainNavItem = NavItem

export type SidebarNavItem = NavItemWithChildren

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
