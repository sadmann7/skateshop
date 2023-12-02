import { unstable_noStore as noStore } from "next/cache"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

export default async function ProtectedAuthLayout({
  children,
}: React.PropsWithChildren) {
  noStore()
  try {
    const user = await currentUser()

    if (user) {
      redirect("/")
    }
  } catch (err) {
    console.error(err)
    redirect("/")
  }

  return <>{children}</>
}
