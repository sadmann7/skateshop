"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { PRODUCT_CATEGORY, Product } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { formatDate, formatEnum, formatPrice } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Table } from "@/components/table"

interface ProductsProps {
  storeId: string
}

export function Products({ storeId }: ProductsProps) {
  const router = useRouter()

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })
  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const columns = React.useMemo<ColumnDef<Product, unknown>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ cell }) => formatEnum(cell.getValue() as PRODUCT_CATEGORY),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ cell }) => formatPrice(cell.getValue() as number),
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
      },
      {
        accessorKey: "inventory",
        header: "Inventory",
      },
      {
        accessorKey: "rating",
        header: "Rating",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ cell }) => formatDate(cell.getValue() as Date),
        enableColumnFilter: false,
      },
    ],
    []
  )

  const { data, isLoading, isError, isRefetching } = useQuery(
    ["products", storeId, pagination],
    async () => {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeId,
          page: pagination.pageIndex,
          perPage: pagination.pageSize,
        }),
      })

      const { products, count } = (await response.json()) as {
        products: Product[]
        count: number
      }
      return { products, count }
    },
    {
      enabled: !!storeId,
      refetchOnWindowFocus: false,
    }
  )

  return (
    <>
      {data?.products.length ? (
        <Table
          tableTitle={`Products (${data?.count ?? 0} entries)`}
          addNewButton={
            <Link
              href={`/account/stores/${storeId}/products/add`}
              className={buttonVariants({
                variant: "outline",
              })}
            >
              Add Product
            </Link>
          }
          columns={columns}
          data={data?.products ?? []}
          state={{
            pagination,
          }}
          setPagination={setPagination}
          itemsCount={data?.count ?? 0}
          isLoading={isLoading}
          isRefetching={isRefetching}
          isError={isError}
          manualPagination
          rowHoverEffect
          disableGlobalFilter={false}
          bodyRowProps={(row) => ({
            onClick: () => {
              const productId = row.original.id
              void router.push(
                `/account/stores/${storeId}/products/${productId}`
              )
            },
          })}
        />
      ) : (
        <Link
          href={`/account/stores/${storeId}/products/add`}
          className="w-fit"
        >
          <div className="flex aspect-video h-40 flex-col rounded-md border p-5 shadow-md hover:bg-muted">
            <div className="flex items-center space-x-2">
              <Icons.add className="h-5 w-5 text-muted-foreground" />
              <h2 className="line-clamp-1 flex-1 text-lg font-bold">
                Create a new product
              </h2>
            </div>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">
              Create a new product to get started.
            </p>
          </div>
          <span className="sr-only">Create a new product</span>
        </Link>
      )}
    </>
  )
}
