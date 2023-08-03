"use client"

import * as React from "react"
import Link from "next/link"
import { products, type Product } from "@/db/schema"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"

import { catchError, formatDate, formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { deleteProductAction } from "@/app/_actions/product"

interface ProductsTableShellProps {
  data: Product[]
  pageCount: number
  storeId: number
}

export function ProductsTableShell({
  data,
  pageCount,
  storeId,
}: ProductsTableShellProps) {
  const [isPending, startTransition] = React.useTransition()
  const [selectedRowIds, setSelectedRowIds] = React.useState<number[]>([])

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<Product, unknown>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value)
              setSelectedRowIds((prev) =>
                prev.length === data.length ? [] : data.map((row) => row.id)
              )
            }}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value)
              setSelectedRowIds((prev) =>
                value
                  ? [...prev, row.original.id]
                  : prev.filter((id) => id !== row.original.id)
              )
            }}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Category" />
        ),
        cell: ({ cell }) => {
          const categories = Object.values(products.category.enumValues)
          const category = cell.getValue() as Product["category"]

          if (!categories.includes(category)) return null

          return (
            <Badge variant="outline" className="capitalize">
              {category}
            </Badge>
          )
        },
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ cell }) => formatPrice(cell.getValue() as number),
      },
      {
        accessorKey: "inventory",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Inventory" />
        ),
      },
      {
        accessorKey: "rating",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Rating" />
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ cell }) => formatDate(cell.getValue() as Date),
        enableColumnFilter: false,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/stores/${storeId}/products/${row.original.id}`}
                >
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/product/${row.original.id}`}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  startTransition(() => {
                    row.toggleSelected(false)

                    toast.promise(
                      deleteProductAction({
                        id: row.original.id,
                        storeId,
                      }),
                      {
                        loading: "Deleting...",
                        success: () => "Product deleted successfully.",
                        error: (err: unknown) => catchError(err),
                      }
                    )
                  })
                }}
                disabled={isPending}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [data, isPending, storeId]
  )

  function deleteSelectedRows() {
    toast.promise(
      Promise.all(
        selectedRowIds.map((id) =>
          deleteProductAction({
            id,
            storeId,
          })
        )
      ),
      {
        loading: "Deleting...",
        success: () => {
          setSelectedRowIds([])
          return "Products deleted successfully."
        },
        error: (err: unknown) => {
          setSelectedRowIds([])
          return catchError(err)
        },
      }
    )
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      filterableColumns={[
        {
          id: "category",
          title: "Category",
          options: products.category.enumValues.map((category) => ({
            label: `${category.charAt(0).toUpperCase()}${category.slice(1)}`,
            value: category,
          })),
        },
      ]}
      searchableColumns={[
        {
          id: "name",
          title: "names",
        },
      ]}
      newRowLink={`/dashboard/stores/${storeId}/products/new`}
      deleteRowsAction={() => void deleteSelectedRows()}
    />
  )
}
