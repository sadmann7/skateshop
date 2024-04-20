import { NextResponse } from "next/server"
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()

  if (!auth().userId) {
    //  If user tries to access a private route without being authenticated,
    //  redirect them to the sign in page
    const url = new URL(req.nextUrl.origin)
    url.pathname = "/signin"
    return NextResponse.redirect(url)
  }
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
