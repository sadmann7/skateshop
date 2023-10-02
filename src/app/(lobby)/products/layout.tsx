interface ProductsLayoutProps {
  children: React.ReactNode
  modal: React.PropsWithChildren
}

export default function ProductsLayout({
  children,
  modal,
}: ProductsLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
