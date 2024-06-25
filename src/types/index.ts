import { type Store } from "@/db/schema"
import { type SQL } from "drizzle-orm"
import type Stripe from "stripe"
import { type ClientUploadedFileData } from "uploadthing/types"

import type { Icons } from "@/components/icons"

export interface NavItem {
  title: string
  href?: string
  active?: boolean
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
  description?: string
}

export interface NavItemWithChildren extends NavItem {
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

export type MainNavItem = NavItemWithChildren

export type SidebarNavItem = NavItemWithChildren

export interface SearchParams {
  [key: string]: string | string[] | undefined
}

export interface UploadedFile<T = unknown> extends ClientUploadedFileData<T> {}

export interface StoredFile {
  id: string
  name: string
  url: string
}

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  withCount?: boolean
}

export interface DataTableFilterField<TData> {
  label: string
  value: keyof TData
  placeholder?: string
  options?: Option[]
}

export type DrizzleWhere<T> =
  | SQL<unknown>
  | ((aliases: T) => SQL<T> | undefined)
  | undefined

export type StripePaymentStatus = Stripe.PaymentIntent.Status

export interface Plan {
  id: Store["plan"]
  title: string
  description: string
  features: string[]
  stripePriceId: string
  limits: {
    stores: number
    products: number
    tags: number
    variants: number
  }
}

export interface PlanWithPrice extends Plan {
  price: string
}

export interface UserPlan extends Plan {
  stripeSubscriptionId?: string | null
  stripeCurrentPeriodEnd?: string | null
  stripeCustomerId?: string | null
  isSubscribed: boolean
  isCanceled: boolean
  isActive: boolean
}
