"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { products, type Product } from "@/db/schema"
import dayjs from "dayjs"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Calendar as CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { toast } from "sonner"
import {
  Table as ShadcnTable,
  type ColumnDef,
  type ColumnSort,
  type PaginationState,
} from "unstyled-table"

import { cn, formatDate, formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DebounceInput } from "@/components/debounce-input"
import { Icons } from "@/components/icons"
import {
  deleteProductAction,
  deleteProductsAction,
} from "@/app/_actions/product"

interface ProductsTableProps {
  data: Product[]
  pageCount?: number
  storeId: number
}

export function ProductsTable({
  data,
  pageCount,
  storeId,
}: ProductsTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // This lets us update states without blocking the UI
  // Read more: https://react.dev/reference/react/useTransition#usage
  const [isPending, startTransition] = React.useTransition()

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
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value)
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
        header: "Price",
        cell: ({ cell }) => formatPrice(cell.getValue() as number),
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
        enableHiding: false,
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
              <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/stores/${storeId}/products/${product.id}`}
                  >
                    <Icons.edit
                      className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                      aria-hidden="true"
                    />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/products/${product.id}`}>
                    <Icons.view
                      className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                      aria-hidden="true"
                    />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    startTransition(async () => {
                      await deleteProductAction({
                        storeId,
                        id: product.id,
                      })
                      toast.success("Product deleted")
                    })
                  }}
                >
                  <Icons.trash
                    className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                    aria-hidden="true"
                  />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [storeId]
  )

  // Search params
  const page = searchParams?.get("page") ?? "1"
  const per_page = searchParams?.get("per_page") ?? "10"
  const sort = searchParams?.get("sort")
  const [column, order] = sort?.split(".") ?? []
  const name = searchParams?.get("name")
  const date_range = searchParams?.get("date_range")

  // Create query string
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

  // Handle server-side column (name) filtering
  const [nameFilter, setNameFilter] = React.useState(name ?? "")

  // Handle server-side column (date) filtering
  const [dateFilter, setDateFilter] = React.useState<DateRange | undefined>(
    date_range
      ? {
          from: dayjs(date_range.split("to")[0]).toDate(),
          to: dayjs(date_range.split("to")[1]).toDate(),
        }
      : undefined
  )

  const [isDateChanged, setIsDateChanged] = React.useState(false)

  // Handle server-side column sorting
  const [sorting, setSorting] = React.useState<ColumnSort[]>([
    {
      id: column ?? "createdAt",
      desc: order === "desc" ? true : false,
    },
  ])

  React.useEffect(() => {
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({
          page,
          sort: sorting[0]?.id
            ? `${sorting[0]?.id}.${sorting[0]?.desc ? "desc" : "asc"}`
            : null,
        })}`
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting])

  // Handle server-side pagination
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: Number(page) - 1,
    pageSize: Number(per_page),
  })

  return (
    <div className="w-full overflow-hidden">
      <div className={cn("grid gap-2 px-1 pb-1")}>
        <Popover
          // update start_date and end_date when the popover is closed
          onOpenChange={(isOpen) => {
            if (!isOpen && isDateChanged) {
              startTransition(() => {
                router.push(
                  `${pathname}?${createQueryString({
                    page: 1,
                    date_range: dateFilter
                      ? `${dayjs(dateFilter.from).format(
                          "YYYY-MM-DD"
                        )}to${dayjs(dateFilter.to).format("YYYY-MM-DD")}`
                      : null,
                  })}`
                )
              })
            }
            setIsDateChanged(false)
          }}
        >
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "h-8 justify-start text-left font-normal lg:w-[280px]",
                !dateFilter && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFilter?.from ? (
                dateFilter.to ? (
                  <>
                    {formatDate(dateFilter.from)} - {formatDate(dateFilter.to)}
                  </>
                ) : (
                  formatDate(dateFilter.from)
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateFilter?.from}
              selected={dateFilter}
              onSelect={(date) => {
                setDateFilter(date)
                setIsDateChanged(true)
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      <ShadcnTable
        columns={columns}
        // The inline `[]` prevents re-rendering the table when the data changes.
        data={data ?? []}
        // Rows per page
        pageCount={pageCount ?? 0}
        // States controlled by the table
        state={{ sorting, pagination }}
        // Manually controlled states
        manualPagination
        manualSorting
        setSorting={setSorting}
        setPagination={setPagination}
        // Table renderers
        renders={{
          table: ({ children, tableInstance }) => {
            return (
              <div className="w-full space-y-4 p-1">
                <div className="flex items-center gap-2 overflow-x-auto overflow-y-hidden">
                  <DebounceInput
                    className="h-8 w-[150px] lg:w-[280px]"
                    placeholder="Filter names..."
                    value={nameFilter}
                    onChange={(value) => {
                      setNameFilter(String(value))
                      startTransition(() => {
                        router.push(
                          `${pathname}?${createQueryString({
                            page: 1,
                            name: String(value),
                          })}`
                        )
                      })
                    }}
                  />
                  <div className="ml-auto flex items-center space-x-2">
                    {tableInstance.getFilteredSelectedRowModel().rows.length ===
                    0 ? (
                      <Button
                        aria-label="Add new product"
                        size="sm"
                        className="h-8"
                        onClick={() => router.push(`${pathname}/new`)}
                      >
                        <Icons.addCircle className="mr-2 h-4 w-4" />
                        <span className="hidden lg:inline-block">
                          New product
                        </span>
                        <span className="inline-block lg:hidden">New</span>
                      </Button>
                    ) : (
                      <Button
                        aria-label="Delete selected rows"
                        variant="destructive"
                        size="sm"
                        className="h-8"
                        onClick={() => {
                          startTransition(async () => {
                            // Delete the selected rows
                            try {
                              await deleteProductsAction({
                                storeId,
                                ids: tableInstance
                                  .getSelectedRowModel()
                                  .rows.map((row) => row.original.id),
                              })
                            } catch (error) {
                              error instanceof Error
                                ? toast.error(error.message)
                                : toast.error("Something went wrong")
                            }
                            // Reset row selection
                            tableInstance.resetRowSelection()
                          })
                        }}
                        disabled={
                          !tableInstance.getSelectedRowModel().rows.length ||
                          isPending
                        }
                      >
                        <Icons.trash className="mr-2 h-4 w-4" aria-hidden />
                        Delete (
                        {tableInstance.getSelectedRowModel().rows.length})
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-label="Download" className="h-8">
                          <Icons.downlaod
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                          />
                          Download
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[150px]">
                        <DropdownMenuItem
                          onClick={() => {
                            const rows =
                              tableInstance.getFilteredSelectedRowModel().rows
                                .length > 0
                                ? tableInstance.getFilteredSelectedRowModel()
                                    .rows
                                : tableInstance.getFilteredRowModel().rows

                            const csv = rows
                              .map((row) => {
                                return [
                                  row.original.name,
                                  row.original.category,
                                  row.original.price,
                                  row.original.inventory,
                                  row.original.rating,
                                ].join(",")
                              })
                              .join("\n")

                            const blob = new Blob([csv], { type: "text/csv" })
                            const url = window.URL.createObjectURL(blob)
                            const a = document.createElement("a")
                            a.setAttribute("hidden", "")
                            a.setAttribute("href", url)
                            a.setAttribute("download", "products.csv")
                            document.body.appendChild(a)
                            a.click()
                            document.body.removeChild(a)
                          }}
                        >
                          Download CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const rows =
                              tableInstance.getFilteredSelectedRowModel().rows
                                .length > 0
                                ? tableInstance.getFilteredSelectedRowModel()
                                    .rows
                                : tableInstance.getFilteredRowModel().rows

                            const visibleColumns = tableInstance
                              .getAllColumns()
                              .filter(
                                (column) =>
                                  typeof column.accessorFn !== "undefined" &&
                                  column.getCanHide()
                              )

                            const doc = new jsPDF()

                            autoTable(doc, {
                              head: [
                                // @ts-expect-error - columnDef.header is need to be RowInput
                                visibleColumns.map(
                                  (column) => column.columnDef.header
                                ),
                              ],
                              body: rows.map((row) => {
                                return [
                                  row.original.name,
                                  row.original.category,
                                  row.original.price,
                                  row.original.inventory,
                                  row.original.rating,
                                ]
                              }),
                            })
                            doc.save("products.pdf")
                          }}
                        >
                          Download PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-label="Control view"
                          variant="outline"
                          className="ml-auto h-8"
                        >
                          <Icons.horizontalSliders className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[150px]">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {tableInstance
                          .getAllColumns()
                          .filter(
                            (column) =>
                              typeof column.accessorFn !== "undefined" &&
                              column.getCanHide()
                          )
                          .map((column) => {
                            return (
                              <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => {
                                  column.toggleVisibility(!!value)
                                }}
                              >
                                {column.id}
                              </DropdownMenuCheckboxItem>
                            )
                          })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>{children}</Table>
                </div>
              </div>
            )
          },
          header: ({ children }) => <TableHeader>{children}</TableHeader>,
          headerRow: ({ children }) => <TableRow>{children}</TableRow>,
          headerCell: ({ children }) => (
            <TableHead className="whitespace-nowrap">{children}</TableHead>
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
          paginationBar: ({ tableInstance }) => {
            return (
              <div className="flex flex-col-reverse items-center gap-4 py-2 md:flex-row">
                <div className="flex-1 text-sm font-medium">
                  {tableInstance.getFilteredSelectedRowModel().rows.length} of{" "}
                  {per_page} row(s) selected.
                </div>
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-sm font-medium">Rows per page</span>
                    <Select
                      value={per_page}
                      onValueChange={(value) => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page: 1,
                              per_page: value,
                              sort,
                            })}`
                          )
                        })
                      }}
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-8 w-16">
                        <SelectValue placeholder={per_page} />
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
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page: 1,
                              per_page,
                              sort,
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
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page: Number(page) - 1,
                              per_page,
                              sort,
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
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page: Number(page) + 1,
                              per_page,
                              sort,
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
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        router.push(
                          `${pathname}?${createQueryString({
                            page: pageCount ?? 10,
                            per_page,
                            sort,
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
