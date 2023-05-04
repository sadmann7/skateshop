"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Product } from "@prisma/client"
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import dayjs from "dayjs"

import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Table } from "@/components/table"

type fieldValue = string | undefined

interface ProductsProps {
  storeId: string
}

export function Products({ storeId }: ProductsProps) {
  const router = useRouter()

  const [data, setData] = React.useState<{
    products: Product[] | null
    count: number
  }>({
    products: null,
    count: 0,
  })
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: false,
      createdBy: false,
      updatedBy: false,
      updatedAt: false,
    })
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
      { accessorKey: "id", enableColumnFilter: false, enableSorting: false },
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ cell }) =>
          cell.getValue() ? formatPrice(Number(cell.getValue())) : "-",
        enableColumnFilter: false,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ cell }) =>
          dayjs(cell.getValue() as Date).format("DD/MM/YYYY, hh:mm a"),
        enableColumnFilter: false,
      },
      {
        accessorKey: "createdBy",
        header: "Created By",
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ cell, row }) =>
          row.getValue("updatedBy")
            ? dayjs(cell.getValue() as Date).format("DD/MM/YYYY, hh:mm a")
            : "-",
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "updatedBy",
        header: "Updated By",
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    []
  )

  // get paginated products from prisma
  React.useEffect(() => {
    async function getProducts() {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeId,
          page: pagination.pageIndex,
          perPage: pagination.pageSize,
          name: columnFilters.find((f) => f.id === "name")?.value as fieldValue,
          sortBy: sorting[0]?.id as
            | "name"
            | "createdAt"
            | "price"
            | "published"
            | undefined,
          sortDesc: sorting[0]?.desc,
        }),
      })
      const { products, count } = (await response.json()) as {
        products: Product[]
        count: number
      }
      setData({ products, count })
    }

    void getProducts()
  }, [pagination, columnFilters, sorting, storeId])

  return (
    <Table
      tableTitle={
        <>
          {`Products (${data?.count ?? 0} entries)`}
          <Link
            href={`/account/stores/${storeId}/products/add`}
            className="ml-4"
          >
            <Button>Add product</Button>
          </Link>
        </>
      }
      columns={columns}
      data={data?.products ?? []}
      state={{
        sorting,
        pagination,
        columnVisibility,
        columnFilters,
      }}
      setSorting={setSorting}
      setColumnFilters={setColumnFilters}
      setColumnVisibility={setColumnVisibility}
      setPagination={setPagination}
      itemsCount={data?.count}
      isLoading={false}
      isRefetching={false}
      isError={false}
      manualFiltering
      manualPagination
      manualSorting
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
