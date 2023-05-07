import * as React from "react"
import Image from "next/image"
import { UploadCloud } from "lucide-react"
import {
  useDropzone,
  type Accept,
  type ErrorCode,
  type FileRejection,
} from "react-dropzone"
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form"
import { toast } from "react-hot-toast"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Icons } from "@/components/icons"

export interface FileDialogProps<TFieldValues extends FieldValues>
  extends React.HTMLAttributes<HTMLDivElement> {
  setValue: UseFormSetValue<TFieldValues>
  name: Path<TFieldValues>
  accept?: Accept
  maxSize?: number
  maxFiles?: number
  previewType?: "image" | "name"
  isUploading?: boolean
  disabled?: boolean
}

export function FileDialog<TFieldValues extends FieldValues>({
  name,
  setValue,
  accept = {
    "image/png": [],
    "image/jpeg": [],
  },
  maxSize = 1024 * 1024 * 2,
  maxFiles = 1,
  previewType = "image",
  isUploading = false,
  disabled = false,
  className,
  ...props
}: FileDialogProps<TFieldValues>) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      acceptedFiles.forEach((file) => {
        if (!file) return
        setValue(name, file as PathValue<TFieldValues, Path<TFieldValues>>, {
          shouldValidate: true,
        })
        setSelectedFile(file)
      })
      rejectedFiles.forEach((file) => {
        setValue(name, null as PathValue<TFieldValues, Path<TFieldValues>>, {
          shouldValidate: true,
        })
        setSelectedFile(null)
        switch (file.errors[0]?.code as ErrorCode) {
          case "file-invalid-type":
            toast.error("File type not supported")
            break
          case "file-too-large":
            const size = (file.file.size / 1024 / 1024).toFixed(2)
            toast.error(
              `Please select a file smaller than ${
                maxSize / 1024 / 1024
              }MB. Current size: ${size}MB`
            )
            break
          case "too-many-files":
            toast.error("Please select only one file")
            break
          default:
            toast.error(file.errors[0]?.message ?? "Error uploading file")
            break
        }
      })
    },
    [maxSize, name, setSelectedFile, setValue]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
  })

  // revoke object URL when component unmounts
  React.useEffect(() => {
    if (!selectedFile) return
    return () => URL.revokeObjectURL(selectedFile.name)
  }, [selectedFile])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Upload Images
          <span className="sr-only">Upload Images</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <div
          {...getRootProps()}
          className={cn(
            "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition hover:bg-muted/25",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isDragActive
              ? "border-muted-foreground/50"
              : "border-muted-foreground/25",
            disabled && "pointer-events-none opacity-60",
            className
          )}
          {...props}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="group grid w-full place-items-center gap-1 sm:px-10">
              <Icons.upload
                className="h-9 w-9 animate-pulse text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          ) : isDragActive ? (
            <div className="grid place-items-center gap-2 text-muted-foreground sm:px-5">
              <Icons.upload
                className={cn("h-9 w-9", isDragActive && "animate-bounce")}
                aria-hidden="true"
              />
              <p className="text-base font-medium">Drop the file here</p>
            </div>
          ) : (
            <div className="grid place-items-center gap-1 sm:px-5">
              <Icons.upload
                className="h-9 w-9 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="mt-2 text-base font-medium text-muted-foreground">
                Drag {`'n'`} drop file here, or click to select file
              </p>
              <p className="text-sm text-slate-500">
                Please upload file with size less than{" "}
                {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
