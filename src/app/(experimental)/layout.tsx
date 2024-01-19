import { currentUser } from "@clerk/nextjs"

import { SiteHeader } from "@/components/layouts/site-header"

export default async function ExperimentalLayout({
  children,
}: React.PropsWithChildren) {
  const user = await currentUser()

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
