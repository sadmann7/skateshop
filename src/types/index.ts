import type { LucideIcon } from "lucide-react"
import type {
  DropzoneInputProps,
  DropzoneRootProps,
  FileWithPath,
} from "react-dropzone"

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

export type FullFile = {
  file: FileWithPath
  contents: string
}

export type UploadThingOutput = {
  fileKey: string
  fileUrl: string
}
