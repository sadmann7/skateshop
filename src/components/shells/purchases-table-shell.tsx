"use client"

import * as React from "react"
import Link from "next/link"
import { type Order } from "@/db/schema"
import type { StripePaymentStatus } from "@/types"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
import { z } from "zod"

import {
  getStripePaymentStatusColor,
  stripePaymentStatuses,
} from "@/lib/checkout"
import { cn, formatDate, formatId, formatPrice } from "@/lib/utils"
import { checkoutItemSchema } from "@/lib/validations/cart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

export type AwaitedOrder = Pick<
  Order,
  "id" | "email" | "items" | "amount" | "createdAt" | "storeId"
> & {
  status: Order["stripePaymentIntentStatus"]
  store: string | null
}

interface PurchasesTableShellProps {
  promise: Promise<{
    data: AwaitedOrder[]
    pageCount: number
  }>
}

export function PurchasesTableShell({ promise }: PurchasesTableShellProps) {
  const { data, pageCount } = React.use(promise)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<AwaitedOrder, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Order ID" />
        ),
        cell: ({ cell }) => {
          return <span>{formatId(Number(cell.getValue()))}</span>
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Payment Status" />
        ),
        cell: ({ cell }) => {
          return (
            <Badge
              variant="outline"
              className={cn(
                "pointer-events-none text-sm capitalize text-white",
                getStripePaymentStatusColor({
                  status: cell.getValue() as StripePaymentStatus,
                  shade: 600,
                })
              )}
            >
              {String(cell.getValue())}
            </Badge>
          )
        },
      },
      {
        accessorKey: "store",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Store Name" />
        ),
      },
      {
        accessorKey: "items",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Quantity" />
        ),
        cell: ({ cell }) => {
          const safeParsedItems = z
            .array(checkoutItemSchema)
            .safeParse(JSON.parse(cell.getValue() as string))

          return (
            <span>
              {safeParsedItems.success
                ? safeParsedItems.data.reduce(
                    (acc, item) => acc + item.quantity,
                    0
                  )
                : 0}
            </span>
          )
        },
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ cell }) => formatPrice(cell.getValue() as number),
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
                <Link href={`/dashboard/purchases/${row.original.id}`}>
                  Purchase details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/products?store_ids=${row.original.storeId}`}>
                  View store
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      searchableColumns={[
        {
          id: "store",
          title: "stores",
        },
      ]}
      filterableColumns={[
        {
          id: "status",
          title: "Status",
          options: stripePaymentStatuses,
        },
      ]}
    />
  )
}
