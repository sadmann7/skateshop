"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { SortDirection } from "@/types"
import { type Product } from "@prisma/client"
import { toast } from "react-hot-toast"
import {
  Table as ShadcnTable,
  type ColumnDef,
  type ColumnSort,
  type Row,
  type VisibilityState,
} from "unstyled-table"

import { formatDate, formatEnum, formatPrice } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { deleteProductsAction } from "@/app/_actions/product"

import { Icons } from "./icons"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { DebouncedInput } from "./ui/debounced"
import { Input } from "./ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Skeleton } from "./ui/skeleton"

interface ProductsTableProps {
  data: Product[]
  pageCount?: number
}

export function ProductsTable({ data, pageCount }: ProductsTableProps) {
  const router = useRouter()
  const pathname = usePathname() ?? ""
  const searchParams = useSearchParams()

  // This lets us update states without blocking the UI
  // Read more: https://react.dev/reference/react/useTransition#usage
  const [isPending, startTransition] = React.useTransition()

  const page = searchParams?.get("page") ?? "1"
  const items = searchParams?.get("items") ?? "10"
  const sort = (searchParams?.get("sort") ?? "name") as keyof Product
  const order = (searchParams?.get("order") ?? "asc") as SortDirection | null
  const query = searchParams?.get("query")

  // create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString())

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      }

      return newSearchParams.toString()
    },
    [searchParams]
  )

  // Handle row selection
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedRows, setSelectedRows] = React.useState<Row<Product>[]>([])

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<Product, unknown>[]>(
    () => [
      {
        // Column for row selection
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value)
              //* This is a workaround for row selection without using the Row Selection API
              setSelectedRows(value ? table.getRowModel().rows : [])
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value)
              //* This is a workaround for row selection without using the Row Selection API
              setSelectedRows((rows) =>
                value ? [...rows, row] : rows.filter((r) => r !== row)
              )
            }}
            aria-label="Select row"
          />
        ),
        // Disable column sorting for this column
        enableSorting: false,
        enableHiding: false,
      },
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => formatEnum(row.original.category),
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
      {
        // Column for row actions
        id: "actions",
        cell: ({ row }) => {
          const product = row.original

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                >
                  <Icons.verticalThreeDots
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    void navigator.clipboard.writeText(product.id)
                    toast.success("Product ID copied to clipboard")
                  }}
                >
                  Copy skater ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View skater</DropdownMenuItem>
                <DropdownMenuItem>View deck details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    []
  )

  // Handle global filtering
  const [globalFilter, setGlobalFilter] = React.useState("")

  // Handle column visibility
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  // Handle server-side column (name) filtering
  const [name, setName] = React.useState(query ?? "")

  // Handle server-side column sorting
  const [sorting] = React.useState<ColumnSort[]>([
    {
      id: sort,
      desc: order === "desc" ? true : false,
    },
  ])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-5 py-4">
        <Input
          className="hidden max-w-xs"
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <DebouncedInput
          className="max-w-xs"
          placeholder="Filter name..."
          value={name}
          onChange={(value) => {
            setName(value.toString())
            startTransition(() => {
              router.push(
                `${pathname}?${createQueryString({
                  page: page,
                  query: value.toString(),
                })}`
              )
            })
          }}
        />
        <div className="flex items-center space-x-2">
          <Button
            aria-label="Delete rows"
            variant="destructive"
            onClick={() => {
              startTransition(() => {
                void deleteProductsAction(
                  selectedRows.map((row) => row.original.id)
                )
                setSelectedRows([])
                toast.success("Skaters deleted")
              })
            }}
            disabled={isPending || !selectedRows.length}
          >
            Delete
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
                <Icons.chevronDown
                  className="-mr-1 ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto min-w-[8rem] p-1">
              <div className="flex items-center space-x-2 rounded-sm p-2 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <input id="toggleAllColumns" type="checkbox" className="peer" />
                <label
                  htmlFor="toggleAllColumns"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Toggle All
                </label>
              </div>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-2 rounded-sm p-2 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <input type="checkbox" id={i.toString()} className="peer" />
                  <label
                    htmlFor={i.toString()}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {`Column ${i}`}
                  </label>
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <ShadcnTable
        columns={columns}
        // The inline `[]` prevents re-rendering the table when the data changes.
        data={data ?? []}
        // States controlled by the table
        state={{ globalFilter, columnVisibility, sorting }}
        // Handle global filtering
        setGlobalFilter={setGlobalFilter}
        // Handle column visibility
        setColumnVisibility={setColumnVisibility}
        // Handle server-side sorting
        manualPagination
        manualFiltering
        itemsCount={Number(items)}
        renders={{
          table: ({ children }) => <Table>{children}</Table>,
          header: ({ children }) => <TableHeader>{children}</TableHeader>,
          headerRow: ({ children }) => <TableRow>{children}</TableRow>,
          headerCell: ({ children, header }) => (
            <TableHead
              className="whitespace-nowrap"
              // Handle server-side column sorting
              onClick={() => {
                const isSortable = header.column.getCanSort()
                const nextSortDirection = header.column.getNextSortingOrder()

                // Update the URL with the new sort order if the column is sortable
                isSortable &&
                  startTransition(() => {
                    router.push(
                      `${pathname}?${createQueryString({
                        page: page,
                        sort: nextSortDirection ? header.column.id : null,
                        order: nextSortDirection ? nextSortDirection : null,
                      })}`
                    )
                  })
              }}
            >
              {children}
            </TableHead>
          ),
          body: ({ children }) => (
            <TableBody>
              {data.length
                ? children
                : !isPending && (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          ),
          bodyRow: ({ children }) => <TableRow>{children}</TableRow>,
          bodyCell: ({ children }) => (
            <TableCell>
              {isPending ? <Skeleton className="h-6 w-20" /> : children}
            </TableCell>
          ),
          filterInput: ({}) => null,
          // Custom pagination bar
          paginationBar: () => {
            return (
              <div className="flex flex-col-reverse items-center gap-4 py-4 md:flex-row">
                <div className="flex-1 text-sm font-medium">
                  {selectedRows.length} of {items} row(s) selected.
                </div>
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-sm font-medium">Rows per page</span>
                    <Select
                      value={items}
                      onValueChange={(value) => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page: page,
                              items: value,
                              sort: sort,
                              order: order,
                            })}`
                          )
                        })
                      }}
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-8 w-16">
                        <SelectValue placeholder={items} />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 20, 30, 40, 50].map((item) => (
                          <SelectItem key={item} value={item.toString()}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-sm font-medium">
                    {`Page ${page} of ${pageCount ?? 10}`}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 px-0"
                      onClick={() => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page: 1,
                              items: items,
                              sort: sort,
                              order: order,
                            })}`
                          )
                        })
                      }}
                      disabled={Number(page) === 1 || isPending}
                    >
                      <Icons.chevronsLeft
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">First page</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 px-0"
                      onClick={() => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page: Number(page) - 1,
                              items: items,
                              sort: sort,
                              order: order,
                            })}`
                          )
                        })
                      }}
                      disabled={Number(page) === 1 || isPending}
                    >
                      <Icons.chevronLeft
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Previous page</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 px-0"
                      onClick={() => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page: Number(page) + 1,
                              items: items,
                              sort: sort,
                              order: order,
                            })}`
                          )
                        })
                      }}
                      disabled={Number(page) === (pageCount ?? 10) || isPending}
                    >
                      <Icons.chevronRight
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Next page</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 px-0"
                      onClick={() => {
                        router.push(
                          `${pathname}?${createQueryString({
                            page: pageCount ?? 10,
                            items: items,
                            sort: sort,
                            order: order,
                          })}`
                        )
                      }}
                      disabled={Number(page) === (pageCount ?? 10) || isPending}
                    >
                      <Icons.chevronsRight
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Last page</span>
                    </Button>
                  </div>
                </div>
              </div>
            )
          },
        }}
      />
    </div>
  )
}
