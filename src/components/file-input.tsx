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

interface FileInputProps<TFieldValues extends FieldValues>
  extends React.HTMLAttributes<HTMLDivElement> {
  name: Path<TFieldValues>
  setValue: UseFormSetValue<TFieldValues>
  accept?: Accept
  maxSize?: number
  maxFiles?: number
  parentFiles?: File[] | null
  setParentFiles?: React.Dispatch<React.SetStateAction<File[] | null>>
  previewType?: "image" | "name"
  isUploading?: boolean
  disabled?: boolean
}

export function FileInput<TFieldValues extends FieldValues>({
  name,
  setValue,
  accept = {
    "image/png": [],
    "image/jpeg": [],
  },
  maxSize = 1024 * 1024 * 8,
  maxFiles = 1,
  parentFiles,
  previewType = "image",
  isUploading = false,
  disabled = false,
  className,
  ...props
}: FileInputProps<TFieldValues>) {
  const [files, setFiles] = React.useState<File[] | null>(parentFiles ?? null)

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setFiles(acceptedFiles)

      acceptedFiles.forEach((file) => {
        if (!file) return
        setValue(name, file as PathValue<TFieldValues, Path<TFieldValues>>, {
          shouldValidate: true,
        })
      })
      rejectedFiles.forEach((file) => {
        setValue(name, null as PathValue<TFieldValues, Path<TFieldValues>>, {
          shouldValidate: true,
        })
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
    [maxSize, name, setFiles, setValue]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
  })

  // revoke object URL when component unmounts
  React.useEffect(() => {
    if (!files) return
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.name))
    }
  }, [files])

  return (
    <div
      {...getRootProps()}
      className={cn(
        "group relative grid h-60 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition hover:bg-slate-200/25 dark:hover:bg-slate-700/25 ",
        "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
        isDragActive
          ? "border-slate-900 dark:border-slate-400"
          : "border-slate-500",
        files && previewType === "image" ? "h-full border-none p-0" : "h-60",
        disabled
          ? "pointer-events-none opacity-60"
          : "pointer-events-auto opacity-100",
        className
      )}
      {...props}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <div className="group grid w-full place-items-center gap-1 sm:px-10">
          <UploadCloud
            className="h-10 w-10 animate-pulse text-slate-700 dark:text-slate-400"
            aria-hidden="true"
          />
          <p className="line-clamp-2 text-sm text-slate-950 dark:text-slate-50">
            {files ? files[0]?.name : "Uploading file..."}
          </p>
        </div>
      ) : files ? (
        previewType === "image" ? (
          <div className={cn(files.length > 1 ? "grid gap-2" : "")}>
            <div className="group relative aspect-square h-full max-h-[420px] w-full overflow-hidden rounded-lg">
              {isDragActive ? (
                <div className="absolute inset-0 grid h-full w-full place-items-center bg-slate-950/70">
                  <DragActive isDragActive={isDragActive} />
                </div>
              ) : null}
              <Image
                src={URL.createObjectURL(
                  files[files.length - 1] ??
                    new File([""], "preview", { type: "image/png" })
                )}
                alt={files[files.length - 1]?.name ?? "preview"}
                fill
                className="absolute inset-0 -z-10 rounded-lg object-cover"
                loading="lazy"
              />
            </div>
            {files.length > 1 ? (
              <div className="grid gap-2">
                {files.map((file, i) => (
                  <p
                    key={i}
                    className="line-clamp-3 text-base font-medium text-slate-950 dark:text-slate-50 sm:text-lg"
                  >
                    {file.name}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="w-full rounded-lg">
            {isDragActive ? (
              <DragActive isDragActive={isDragActive} />
            ) : maxFiles > 1 ? (
              <></>
            ) : (
              <p className="line-clamp-3 text-base font-medium text-slate-950 dark:text-slate-50 sm:text-lg">
                {files[files.length - 1]?.name}
              </p>
            )}
          </div>
        )
      ) : isDragActive ? (
        <DragActive isDragActive={isDragActive} />
      ) : (
        <div className="grid place-items-center gap-1 sm:px-10">
          <UploadCloud
            className="h-10 w-10 text-slate-700 dark:text-slate-400"
            aria-hidden="true"
          />
          <p className="mt-2 text-base font-medium text-slate-700 dark:text-slate-400 sm:text-lg">
            Drag {`'n'`} drop file here, or click to select file
          </p>
          <p className="text-sm text-slate-500 sm:text-base">
            Please upload file with size less than{" "}
            {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      )}
    </div>
  )
}

export default FileInput

const DragActive = ({ isDragActive }: { isDragActive: boolean }) => {
  return (
    <div className="grid place-items-center gap-2 text-slate-700 dark:text-slate-400 sm:px-10">
      <UploadCloud
        className={cn("h-10 w-10", isDragActive ? "animate-bounce" : "")}
        aria-hidden="true"
      />
      <p className="text-base font-medium sm:text-lg">Drop the file here</p>
    </div>
  )
}
