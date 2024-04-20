import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    const url = new URL(req.nextUrl.origin)

    const unauthenticatedUrl = `${url.origin}/signin`
    const unauthorizedUrl = `${url.origin}/dashboard/stores`

    auth().protect({
      unauthenticatedUrl,
      unauthorizedUrl,
    })
  }
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
