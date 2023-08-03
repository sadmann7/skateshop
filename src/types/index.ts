import { type Product } from "@/db/schema"
import { type FileWithPath } from "react-dropzone"
import { type z } from "zod"

import { type userPrivateMetadataSchema } from "@/lib/validations/auth"
import type { cartItemSchema, checkoutItemSchema } from "@/lib/validations/cart"
import { type Icons } from "@/components/icons"

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
  description?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[]
}

export interface FooterItem {
  title: string
  items: {
    title: string
    href: string
    external?: boolean
  }[]
}

export type MainNavItem = NavItemWithOptionalChildren

export type SidebarNavItem = NavItemWithChildren

export type UserRole = z.infer<typeof userPrivateMetadataSchema.shape.role>

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export type FileWithPreview = FileWithPath & {
  preview: string
}

export interface StoredFile {
  id: string
  name: string
  url: string
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData
  title: string
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: Option[]
}

export type CartItem = z.infer<typeof cartItemSchema>

export type CheckoutItem = z.infer<typeof checkoutItemSchema>

export interface CartLineItem
  extends Pick<
    Product,
    | "id"
    | "name"
    | "images"
    | "category"
    | "subcategory"
    | "price"
    | "inventory"
    | "storeId"
  > {
  quantity?: number
  storeName: string | null
}

export interface SubscriptionPlan {
  id: "basic" | "standard" | "pro"
  name: string
  description: string
  features: string[]
  stripePriceId: string
  price: number
  isCanceled?: boolean
}
