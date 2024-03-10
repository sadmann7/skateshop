import { redirect } from "next/navigation"

import { getCacheduser } from "@/lib/actions/user"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"
import { StoreTabs } from "@/components/store-tabs"

interface StoreLayoutProps extends React.PropsWithChildren {
  params: {
    storeId: string
  }
}

export default async function StoreLayout({
  children,
  params,
}: StoreLayoutProps) {
  const storeId = decodeURIComponent(params.storeId)

  const user = await getCacheduser()

  if (!user) {
    redirect("/signin")
  }

  return (
    <Shell variant="sidebar" className="gap-4">
      <PageHeader>
        <PageHeaderHeading size="sm">Dashboard</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your store
        </PageHeaderDescription>
      </PageHeader>
      <StoreTabs storeId={storeId} />
      <div className="overflow-hidden">{children}</div>
    </Shell>
  )
}
