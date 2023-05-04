"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { PRODUCT_CATEGORY, Product } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { formatDate, formatEnum, formatPrice } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ReactTable } from "@/components/react-table"

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

  const productsQuery = useQuery(
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
    <ReactTable
      tableTitle={
        <div className="flex items-center space-x-4">
          <div>{`Products (${productsQuery.data?.count ?? 0} entries)`}</div>
          <Link
            href={`/account/stores/${storeId}/products/add`}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
            })}
          >
            Add Product
          </Link>
        </div>
      }
      columns={columns}
      data={productsQuery.data?.products ?? []}
      state={{
        pagination,
      }}
      setPagination={setPagination}
      itemsCount={productsQuery.data?.count ?? 0}
      isLoading={productsQuery.isLoading}
      isRefetching={productsQuery.isFetching}
      isError={productsQuery.isError}
      manualPagination
      rowHoverEffect
      disableGlobalFilter
      bodyRowProps={(row) => ({
        onClick: () => {
          const productId = row.original.id
          void router.push(`/account/stores/${storeId}/products/${productId}`)
        },
      })}
    />
  )
}
