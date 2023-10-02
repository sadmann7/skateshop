type ProductsLayoutProps = React.PropsWithChildren & {
  modal : React.PropsWithChildren
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
