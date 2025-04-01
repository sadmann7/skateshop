import type { StoredFile, UploadedFile } from "@/types";
import * as React from "react";
import { toast } from "sonner";
import type { AnyFileRoute, UploadFilesOptions } from "uploadthing/types";

import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { getErrorMessage } from "@/lib/handle-error";
import { uploadFiles } from "@/lib/uploadthing";

interface UseUploadFileOptions<TFileRoute extends AnyFileRoute>
  extends Pick<
    UploadFilesOptions<TFileRoute>,
    "headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"
  > {
  defaultUploadedFiles?: StoredFile[];
}

export function useUploadFile(
  endpoint: keyof OurFileRouter,
  {
    defaultUploadedFiles = [],
    ...props
  }: UseUploadFileOptions<OurFileRouter[keyof OurFileRouter]> = {},
) {
  const [uploadedFiles, setUploadedFiles] =
    React.useState<StoredFile[]>(defaultUploadedFiles);
  const [progresses, setProgresses] = React.useState<Record<string, number>>(
    {},
  );
  const [isUploading, setIsUploading] = React.useState(false);

  async function onUpload(files: File[]) {
    setIsUploading(true);
    try {
      const response = await uploadFiles(endpoint, {
        ...props,
        files,
        onUploadProgress: ({ file, progress }) => {
          setProgresses((prev) => {
            return {
              ...prev,
              [file.name]: progress,
            };
          });
        },
      });

      const formattedResponse: StoredFile[] = response.map((file) => {
        return {
          id: file.key,
          name: file.name,
          url: file.url,
        };
      });

      setUploadedFiles((prev) =>
        prev ? [...prev, ...formattedResponse] : formattedResponse,
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
  };
}
