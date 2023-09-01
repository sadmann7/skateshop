import { DataTableLoading } from "@/components/data-table/data-table-loading"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shells/shell"

export default function PurchasesLoading() {
  return (
    <Shell variant="sidebar">
      <PageHeader>
        <PageHeaderHeading size="sm">Purchases</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your purchases
        </PageHeaderDescription>
      </PageHeader>
      <DataTableLoading columnCount={6} />
    </Shell>
  )
}
