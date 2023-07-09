"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  compareItems,
  rankItem,
  type RankingInfo,
} from "@tanstack/match-sorter-utils"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  sortingFns,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type FilterFns,
  type PaginationState,
  type SortingFn,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"

import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { Icons } from "@/components/icons"

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value as string)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

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

  // Table states
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: Number(page) - 1,
      pageSize: Number(per_page),
    })

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        per_page: pageSize,
      })}`
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize])

  // Handle server-side sorting
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: column ?? "createdAt",
      desc: order === "desc",
    },
  ])

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page,
        sort: sorting[0]?.id
          ? `${sorting[0]?.id}.${sorting[0]?.desc ? "desc" : "asc"}`
          : null,
      })}`
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting])

  // Handle server-side column filtering
  const debouncedName = useDebounce(
    columnFilters.find((f) => f.id === "name")?.value,
    500
  )

  const debouncedDateRange = useDebounce(
    columnFilters.find((f) => f.id === "createdAt")?.value,
    500
  )

  // console.log({
  //   debouncedName,
  //   debouncedDateRange,
  // })

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: 1,
        name: typeof debouncedName === "string" ? debouncedName : null,
      })}`
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName])

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: 1,
        date_range:
          typeof debouncedDateRange === "string" ? debouncedDateRange : null,
      })}`
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDateRange])

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    pageCount: pageCount ?? -1,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  return (
    <div className="space-y-3 p-1">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
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
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
