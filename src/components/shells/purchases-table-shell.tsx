"use client"

import * as React from "react"
import Link from "next/link"
import { type Product, type Order, type Store } from "@/db/schema"
import { type CheckoutItem } from "@/types/index"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
// import { toast } from "sonner"

import { formatDate, formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

interface PurchasesTableShellProps {
  orders: Order[]
  products: Product[]
  pageCount: number
}

export function PurchasesTableShell({
  orders,
  products,
  pageCount,
}: PurchasesTableShellProps) {
  // const [isPending, startTransition] = React.useTransition()
  // const [selectedRowIds, setSelectedRowIds] = React.useState<number[]>([])

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<Order, unknown>[]>(
    () => [
      // {
      //   id: "select",
      //   header: ({ table }) => (
      //     <Checkbox
      //       checked={table.getIsAllPageRowsSelected()}
      //       onCheckedChange={(value) => {
      //         table.toggleAllPageRowsSelected(!!value)
      //         setSelectedRowIds((prev) =>
      //           prev.length === orders.length ? [] : orders.map((row) => row.id)
      //         )
      //       }}
      //       aria-label="Select all"
      //       className="translate-y-[2px]"
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <Checkbox
      //       checked={row.getIsSelected()}
      //       onCheckedChange={(value) => {
      //         row.toggleSelected(!!value)
      //         setSelectedRowIds((prev) =>
      //           value
      //             ? [...prev, row.original.id]
      //             : prev.filter((id) => id !== row.original.id)
      //         )
      //       }}
      //       aria-label="Select row"
      //       className="translate-y-[2px]"
      //     />
      //   ),
      //   enableSorting: false,
      //   enableHiding: false,
      // },
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="ID" />
        ),
      },
      {
        accessorKey: "store",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Store" />
        ),
        cell: ({ cell }) => {
          const store = cell.getValue() as Store

          return (
            <Badge variant="outline" className="capitalize">
              {store.name}
            </Badge>
          )
        },
      },
      {
        accessorKey: "items",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Items" />
        ),
        cell: ({ cell }) => {
          const items = cell.getValue() as CheckoutItem[] | null

          return (
            items?.map((item, index) => (
              <Badge key={index} variant="outline" className="capitalize">
                {item.productId}
              </Badge>
            )) || 'No items'
          )
        },
      },
      {
        accessorKey: "total",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Total" />
        ),
        cell: ({ cell }) => formatPrice(cell.getValue() as number),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Purchased At" />
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
                <Link href={`/purchases/${row.original.id}`}>View</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [] // orders, isPending
  )

  const allItems = orders.flatMap((order) => order.items || [])

  const uniqueItems = allItems.reduce((acc: CheckoutItem[], current: CheckoutItem) => {
    const x = acc.find(item => item.productId === current.productId);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  const productIdToName = products.reduce<Record<number, string>>((map, product) => {
    map[product.id] = product.name;
    return map;
  }, {});
  

  return (
    <DataTable
      columns={columns}
      data={orders}
      pageCount={pageCount}
      filterableColumns={[
        {
          id: "items",
          title: "Item",
          options: uniqueItems.map((item) => ({
            label: `${productIdToName[item.productId] || 'Unknown product'}`,
            value: String(item.productId),
          })),
        },
      ]}
      // searchableColumns={[
      //   {
      //     id: "name",
      //     title: "names",
      //   },
      // ]}
    />
  )
}