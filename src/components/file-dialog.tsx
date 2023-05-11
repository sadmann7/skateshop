import * as React from "react"
import Image from "next/image"
import type { FileWithPreview } from "@/types"
import {
  useDropzone,
  type Accept,
  type FileRejection,
  type FileWithPath,
} from "react-dropzone"
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form"
import { toast } from "react-hot-toast"

import { cn, formatBytes } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Icons } from "@/components/icons"

export interface FileDialogProps<TFieldValues extends FieldValues>
  extends React.HTMLAttributes<HTMLDivElement> {
  name: Path<TFieldValues>
  setValue: UseFormSetValue<TFieldValues>
  accept?: Accept
  maxSize?: number
  maxFiles?: number
  files: FileWithPreview[] | null
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[] | null>>
  isUploading?: boolean
  disabled?: boolean
}

export function FileDialog<TFieldValues extends FieldValues>({
  name,
  setValue,
  accept = {
    "image/*": [],
  },
  maxSize = 1024 * 1024 * 2,
  maxFiles = 1,
  files,
  setFiles,
  isUploading = false,
  disabled = false,
  className,
  ...props
}: FileDialogProps<TFieldValues>) {
  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
      setValue(
        name,
        acceptedFiles as PathValue<TFieldValues, Path<TFieldValues>>,
        {
          shouldValidate: true,
        }
      )

      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      )

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ errors }) => {
          if (errors[0]?.code === "file-too-large") {
            toast.error(
              `File is too large. Max size is ${formatBytes(maxSize)}`
            )
            return
          }
          errors[0]?.message && toast.error(errors[0].message)
        })
      }
    },

    [maxSize, name, setFiles, setValue]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    multiple: maxFiles > 1,
    disabled,
  })

  // revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return
      files.forEach((file) => URL.revokeObjectURL(file.preview))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          Upload Images
          <span className="sr-only">Upload Images</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <p className="absolute left-5 top-4 text-base font-medium text-muted-foreground">
          Upload your images
        </p>
        <div
          {...getRootProps()}
          className={cn(
            "group relative mt-8 grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isDragActive && "border-muted-foreground/50",
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
                className={cn("h-8 w-8", isDragActive && "animate-bounce")}
                aria-hidden="true"
              />
              <p className="text-base font-medium">Drop the file here</p>
            </div>
          ) : (
            <div className="grid place-items-center gap-1 sm:px-5">
              <Icons.upload
                className="h-8 w-8 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="mt-2 text-base font-medium text-muted-foreground">
                Drag {`'n'`} drop file here, or click to select file
              </p>
              <p className="text-sm text-slate-500">
                Please upload file with size less than {formatBytes(maxSize)}
              </p>
            </div>
          )}
        </div>
        <p className="text-center text-sm font-medium text-muted-foreground">
          You can upload up to {maxFiles} {maxFiles === 1 ? "file" : "files"}
        </p>
        {files?.length ? (
          <div className="grid gap-5">
            {files.map((file, i) => (
              <div
                key={i}
                className="relative flex items-center justify-between gap-2.5"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={file.preview}
                    alt={file.name}
                    className="h-10 w-10 shrink-0 rounded-md"
                    width={40}
                    height={40}
                    loading="lazy"
                  />
                  <div className="flex flex-col">
                    <p className="line-clamp-1 text-sm font-medium text-muted-foreground">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)}MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => {
                    setFiles(files?.filter((_, j) => j !== i))
                    setValue(
                      name,
                      files?.filter((_, j) => j !== i) as PathValue<
                        TFieldValues,
                        Path<TFieldValues>
                      >,
                      {
                        shouldValidate: true,
                      }
                    )
                  }}
                >
                  <Icons.close
                    className="h-4 w-4 text-white"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Remove File</span>
                </Button>
              </div>
            ))}
          </div>
        ) : null}
        {files?.length ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2.5 w-full"
            onClick={() => {
              setFiles(null)
              setValue(
                name,
                null as PathValue<TFieldValues, Path<TFieldValues>>,
                {
                  shouldValidate: true,
                }
              )
            }}
          >
            <Icons.trash className="mr-2 h-4 w-4" aria-hidden="true" />
            Remove All
            <span className="sr-only">Remove All</span>
          </Button>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
