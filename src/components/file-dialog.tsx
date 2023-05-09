import * as React from "react"
import Image from "next/image"
import type { FullFileWithPreview } from "@/types"
import { generateReactHelpers } from "@uploadthing/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Icons } from "@/components/icons"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

export interface FileDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  maxSize?: number
  maxFiles?: number
  selectedFiles?: FullFileWithPreview[] | null
  setSelectedFiles?: React.Dispatch<
    React.SetStateAction<FullFileWithPreview[] | null>
  >
  isUploading?: boolean
  disabled?: boolean
}

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export function FileDialog({
  maxSize = 1024 * 1024 * 2,
  maxFiles = 1,
  isUploading = false,
  disabled = false,
  className,
  ...props
}: FileDialogProps) {
  const [selectedFiles, setSelectedFiles] = React.useState<
    FullFileWithPreview[] | null
  >(null)
  const [isDisabled, setIsDisabled] = React.useState(disabled ?? false)

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    files,
    resetFiles,
    startUpload,
  } = useUploadThing("imageUploader")

  // set preview for selected files
  React.useEffect(() => {
    if (!files) return

    setSelectedFiles(
      files.map((file) => ({
        ...file,
        preview: URL.createObjectURL(file.file),
      }))
    )
  }, [files, setSelectedFiles])

  // revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!selectedFiles) return
      selectedFiles.forEach((file) => URL.revokeObjectURL(file.preview))
    }
  }, [selectedFiles])

  // disable upload button if maxFiles is reached
  React.useEffect(() => {
    if (files?.length >= maxFiles) {
      setIsDisabled(true)
    }
  }, [files?.length, maxFiles, resetFiles])

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
            "group relative grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isDragActive && "border-muted-foreground/50",
            isDisabled && "pointer-events-none opacity-60",
            className
          )}
          {...props}
        >
          <input
            {...getInputProps()}
            className="absolute inset-0 z-10 h-full w-full overflow-hidden opacity-0"
            style={{
              display: "block",
            }}
          />
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
          ) : isDisabled ? (
            <div className="grid place-items-center gap-1 sm:px-5">
              <Icons.warning
                className="h-9 w-9 text-destructive"
                aria-hidden="true"
              />
              <p className="mt-2 text-base font-medium text-muted-foreground">
                You have reached the maximum number of files
              </p>
              <p className="text-sm text-slate-500">
                Please remove some files to upload more
              </p>
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
        <p className="mt-2 text-center text-sm font-medium text-muted-foreground">
          You can upload up to {maxFiles} {maxFiles === 1 ? "file" : "files"}
        </p>
        {selectedFiles && (
          <div className="mt-2 grid gap-5">
            {selectedFiles.map((file, i) => (
              <div
                key={i}
                className="relative flex items-center justify-between gap-2.5"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={file.preview}
                    alt={file.file.name}
                    className="h-10 w-10 shrink-0 rounded-md"
                    width={40}
                    height={40}
                    loading="lazy"
                  />
                  <div className="flex flex-col">
                    <p className="line-clamp-1 text-sm font-medium text-muted-foreground">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(file.file.size / 1024 / 1024).toFixed(2)}MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => {
                    resetFiles()
                    setSelectedFiles(null)
                    setIsDisabled(false)
                  }}
                >
                  <Icons.close
                    className="h-4 w-4 text-white"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
