import { Header } from "@/components/header"
import { Shell } from "@/components/shells/shell"

interface PurchasesLayoutProps {
  children: React.ReactNode
}

export default function PurchasesLayout({
  children,
}: PurchasesLayoutProps) {

  return (
    <Shell variant="sidebar" className="gap-4">
      <div className="flex items-center space-x-4">
      <Header
        title="Purchases"
        description="Manage your purchases."
        size="sm"
        className="flex-1" />
      </div>
      <div className="space-y-4 overflow-hidden">
        {children}
      </div>
    </Shell>
  )
}