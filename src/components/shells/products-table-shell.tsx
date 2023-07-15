"use client"

import * as React from "react"
import { products, type Product } from "@/db/schema"
import { type ColumnDef } from "@tanstack/react-table"

import { formatDate, formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/data-table/data-table"

import { DataTableColumnHeader } from "../data-table/data-table-column-header"
import { DataTableRowActions } from "../data-table/data-table-row-actions"

interface ProductsTableShellProps {
  data: Product[]
  pageCount: number
  storeId: number
}

export function ProductsTableShell({
  data,
  pageCount,
}: ProductsTableShellProps) {
  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<Product, unknown>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
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
        cell: ({ row }) => <DataTableRowActions row={row} />,
      },
    ],
    []
  )

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
          title: "Name",
        },
      ]}
    />
  )
}
