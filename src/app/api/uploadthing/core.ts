/** app/api/uploadthing/core.ts */

import { createFilething, type FileRouter } from "uploadthing/server"

import { getCurrentUser } from "@/lib/session"

const f = createFilething()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  productImage: f
    // Set permissions and file types for this FileRoute
    .fileTypes(["image"])
    .maxSize("4MB")
    .middleware(async (req) => {
      // This code runs on your server before upload

      const user = await getCurrentUser()

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized")

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { user }
    })
    .onUploadComplete(({ metadata }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.user)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
