/** app/api/uploadthing/route.ts */
import { ourFileRouter } from "./core";
import { createNextRouteHandler } from "uploadthing/server";
 
// Export routes for Next App Router (/pages/api support coming soon!)
export const { POST } = createNextRouteHandler({
  router: ourFileRouter,
});