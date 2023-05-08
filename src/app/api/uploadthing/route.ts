/** app/api/uploadthing/route.ts */

import { createNextRouteHandler } from "uploadthing/server"

import { ourFileRouter } from "./core"

// Export routes for Next App Router (/pages/api support coming soon!)
export const { POST } = createNextRouteHandler({
  router: ourFileRouter,
})
