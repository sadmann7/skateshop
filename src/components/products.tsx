"use client"

import { useMemo, useState } from "react"
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

interface ProductsProps {
  data: {
    products: Product[]
    count: number
  }
  storeId: string
}

export function Products({ data, storeId }: ProductsProps) {
  const router = useRouter()

  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    createdBy: false,
    updatedBy: false,
    updatedAt: false,
  })
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const columns = useMemo<ColumnDef<Product, unknown>[]>(
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
