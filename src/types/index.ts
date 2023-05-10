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

export type FullFile = {
  file: FileWithPath
  contents: string
}

export type UploadThingProps = {
  readonly getRootProps: <T extends DropzoneRootProps>(
    props?: T | undefined
  ) => T
  readonly getInputProps: <T_1 extends DropzoneInputProps>(
    props?: T_1 | undefined
  ) => T_1
  readonly isDragActive: boolean
  readonly files: FullFile[]
  readonly resetFiles: () => void
  readonly startUpload: () => Promise<any>
}
