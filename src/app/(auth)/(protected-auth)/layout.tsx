import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

export default async function ProtectedAuthLayout({
  children,
}: React.PropsWithChildren) {
  const user = await currentUser()

  if (user) {
    redirect("/")
  }

  return <>{children}</>
}
