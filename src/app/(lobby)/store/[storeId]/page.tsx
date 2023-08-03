
  return (
    <Shell>
      <Breadcrumbs
        segments={[
          {
            title: "Stores",
            href: "/stores",
          },
          {
            title: store.name,
            href: `/store/${store.id}`,
          },
        ]}
      />
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <div className="flex w-full flex-col gap-4">
          <div className="space-y-2">
            <h2 className="line-clamp-1 text-2xl font-bold">{store.name}</h2>
            <p className="text-base text-muted-foreground">
              {store.description}
            </p>
          </div>
          <Separator className="my-1.5" />
          <Products
            products={productsTransaction.items}
            pageCount={pageCount}
            categories={Object.values(products.category.enumValues)}
            stores={storesTransaction.items}
            storePageCount={storePageCount}
          />
        </div>
      </div>
    </Shell>
  )
}