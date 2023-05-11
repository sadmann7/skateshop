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
