
                      setStoreIds(null)
                    })
                  }}
                  disabled={isPending}
                >
                  Clear Filters
                </Button>
              </SheetFooter>
            </div>
          </SheetContent>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Sort stores" size="sm" disabled={isPending}>
              Sort
              <Icons.chevronDown className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.label}
                className={cn(option.value === sort && "font-bold")}
                onClick={() => {
                  startTransition(() => {
                    router.push(
                      `${pathname}?${createQueryString({
                        sort: option.value,
                      })}`
                    )
                  })
                }}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {!isPending && !stores.length ? (
        <div className="mx-auto flex max-w-xs flex-col space-y-1.5">
          <h1 className="text-center text-2xl font-bold">No stores found</h1>
          <p className="text-center text-muted-foreground">
            Try changing your filters, or check back later for new stores
          </p>
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
      {stores.length ? (
        <PaginationButton
          pageCount={pageCount}
          page={page}
          per_page={per_page}
          sort={sort}
          createQueryString={createQueryString}
          router={router}
          pathname={pathname}
          isPending={isPending}
          startTransition={startTransition}
        />
      ) : null}
    </div>
  )
}