interface DashboardLayout {
  children: React.ReactNode
}

export default function AuthLayout({ children }: DashboardLayout) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
    </div>
  )
}
