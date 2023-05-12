"use client"

import * as React from "react"
import { rankItem } from "@tanstack/match-sorter-utils"
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type FilterFn,
  type PaginationState,
  type Table as ReactTable,
  type Row,
  type SortingState,
} from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DebouncedInput } from "@/components/ui/debounced"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Icons } from "@/components/icons"

interface ReactTableProps<TData, TValue = unknown> {
  tableTitle?: string
  addNewButton?: React.ReactNode
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  isRefetching?: boolean
  isError?: boolean
  state?: {
    globalFilter?: string
    pagination?: PaginationState
  }
  setGlobalFilter?: React.Dispatch<React.SetStateAction<string>>
  disableGlobalFilter?: boolean
  setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>
  manualPagination?: boolean
  disableColumnVisibility?: boolean
  itemsPerPageOptions?: number[]
  itemsCount?: number
  headerRowProps?: React.HTMLAttributes<HTMLTableRowElement>
  headerCellProps?: React.HTMLAttributes<HTMLTableCellElement>
  bodyRowProps?:
    | ((row: Row<TData>) => React.HTMLAttributes<HTMLTableRowElement>)
    | React.HTMLAttributes<HTMLTableRowElement>
  bodyCellProps?: React.HTMLAttributes<HTMLTableCellElement>
  footerRowProps?: React.HTMLAttributes<HTMLTableRowElement>
  footerCellProps?: React.HTMLAttributes<HTMLTableCellElement>
  ascendingSortIndecator?: React.ReactNode
  descendingSortIndecator?: React.ReactNode
  rowHoverEffect?: boolean
}

const fuzzyFilter: FilterFn<unknown> = (
  row,
  columnId,
  value: string,
  addMeta
) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

export function Table<TData, TValue = unknown>(
  props: ReactTableProps<TData, TValue>
) {
  const { manualPagination, state } = props

  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ])
  const [globalFilter, setGlobalFilter] = React.useState<string>(
    state?.globalFilter ?? ""
  )

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: state?.pagination?.pageIndex ?? 0,
      pageSize: state?.pagination?.pageSize ?? 10,
    })
  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const table = useReactTable<TData>({
    columns: props.columns,
    data: props.data,
    state: {
      sorting,
      pagination,
      globalFilter,
    },
    filterFns: { fuzzy: fuzzyFilter },
    pageCount:
      manualPagination && props.itemsCount
        ? Math.ceil(
            props.itemsCount /
              (props.state?.pagination?.pageSize ?? pagination.pageSize)
          )
        : undefined,
    manualPagination,
    onSortingChange: setSorting,
    onPaginationChange: props.setPagination ?? setPagination,
    onGlobalFilterChange: props.setGlobalFilter ?? setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    globalFilterFn: fuzzyFilter as FilterFn<TData> | undefined,
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  })

  return (
    <div className="space-y-2.5 overflow-hidden">
      <div className="flex flex-col space-y-2">
        {props.tableTitle && <h2>{props.tableTitle}</h2>}
        <div className="flex items-center justify-between space-x-4 overflow-x-auto whitespace-nowrap py-2.5">
          <div className="flex items-center space-x-4">
            {props.addNewButton && props.addNewButton}
            {props.disableGlobalFilter ? null : (
              <div>
                <Label htmlFor="globalFilterInput" className="sr-only">
                  Search any field
                </Label>
                <Input
                  id="globalFilterInput"
                  placeholder="Search.."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="w-40 border border-muted"
                  disabled={
                    props.isLoading ||
                    props.isRefetching ||
                    props.data.length === 0
                  }
                />
              </div>
            )}
          </div>
          {props.disableColumnVisibility ? null : (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  Show Columns
                  <Icons.chevronDown
                    className="-mr-1 ml-2 h-5 w-5"
                    aria-hidden="true"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-40">
                <div className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      id="toggleAllColumns"
                      type="checkbox"
                      {...{
                        checked: table.getIsAllColumnsVisible(),
                        onChange: table.getToggleAllColumnsVisibilityHandler(),
                      }}
                    />
                    <Label
                      htmlFor="toggleAllColumns"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Toggle All
                    </Label>
                  </div>
                  {table.getAllLeafColumns().map((column) => (
                    <div
                      key={column.id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        id={column.id}
                        {...{
                          checked: column.getIsVisible(),
                          onChange: column.getToggleVisibilityHandler(),
                        }}
                      />
                      <Label
                        htmlFor={column.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {column.id}
                      </Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-hidden py-2.5">
        <table className="w-full border-collapse border">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr {...(props.headerRowProps ?? {})} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className="border-collapse border px-4 pb-3.5 pt-2 text-left text-sm font-bold tracking-wide"
                    {...(props.headerCellProps ?? {})}
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="space-y-2.5">
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "flex flex-wrap gap-1 cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: props.ascendingSortIndecator ?? " 🔼",
                            desc: props.descendingSortIndecator ?? " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {props.isLoading || props.isRefetching ? (
              <tr>
                <td
                  className="border-collapse border px-4"
                  colSpan={table.getVisibleLeafColumns().length}
                >
                  <div className="py-6 text-center text-lg">{"Loading..."}</div>
                </td>
              </tr>
            ) : null}
            {!(props.isLoading && props.isRefetching) && props.isError ? (
              <tr>
                <td
                  className="border-collapse border px-4"
                  colSpan={table.getVisibleLeafColumns().length}
                >
                  <div className="py-6 text-center text-lg">
                    An error occured!
                  </div>
                </td>
              </tr>
            ) : null}
            {!(props.isLoading || props.isRefetching || props.isError)
              ? table.getRowModel().rows.map((row) => (
                  <tr
                    className={cn(
                      props.rowHoverEffect &&
                        "cursor-pointer transition-colors hover:bg-muted/25"
                    )}
                    {...(typeof props.bodyRowProps === "function"
                      ? props.bodyRowProps(row)
                      : props.bodyRowProps ?? {})}
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          className="border-collapse border px-4 py-2"
                          {...(props.bodyCellProps ?? {})}
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))
              : null}
            {!(props.isLoading || props.isRefetching || props.isError) &&
            props.data.length === 0 ? (
              <tr>
                <td
                  className="border-collapse border px-4"
                  colSpan={table.getVisibleLeafColumns().length}
                >
                  <div className="py-6 text-center text-lg">
                    No data available.
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="flex w-full flex-col items-center gap-4 py-4 text-base sm:flex-row">
        <div className="flex items-center space-x-2">
          <Button
            aria-label="Paginate back by 1 page"
            size="sm"
            variant="outline"
            className="h-9 w-9 p-0"
            onClick={() => table.previousPage()}
            disabled={
              props.isLoading || props.isRefetching || props.data.length === 0
            }
          >
            <Icons.chevronLeft className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Paginate forward by 1 page"
            size="sm"
            variant="outline"
            className="h-9 w-9 p-0"
            onClick={() => table.nextPage()}
            disabled={
              props.isLoading ||
              props.isRefetching ||
              !table.getCanNextPage() ||
              props.data.length === 0
            }
          >
            <Icons.chevronRight className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
        {props.data.length > 0 && (
          <div className="flex items-center gap-1">
            <span>Page</span>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </div>
        )}
        <div className="flex items-center space-x-2.5">
          {table.getPageOptions().map((page) => (
            <Button
              aria-label={`Go to page ${page + 1}`}
              key={page}
              size="sm"
              variant="outline"
              className="h-9 w-9 p-0"
              onClick={() => {
                table.setPageIndex(page)
              }}
              disabled={
                props.isLoading || props.isRefetching || props.data.length === 0
              }
            >
              {page + 1}
            </Button>
          ))}
        </div>
        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
            setPagination({
              ...table.getState().pagination,
              pageSize: Number(value),
            })
          }}
          disabled={
            props.isLoading || props.isRefetching || props.data.length === 0
          }
        >
          <SelectTrigger className="h-9 w-28">
            <SelectValue
              placeholder={`Show ${table.getState().pagination.pageSize}`}
            />
          </SelectTrigger>
          <SelectContent>
            {(props.itemsPerPageOptions ?? [10, 20, 30, 40]).map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                Show {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function Filter<TData, TValue = unknown>({
  column,
  table,
}: {
  column: Column<TData, TValue>
  table: ReactTable<TData>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : (Array.from(
            column.getFacetedUniqueValues().keys()
          ).sort() as string[]),
    [column, firstValue]
  )

  return typeof firstValue === "number" ? (
    <DebouncedInput
      type="number"
      min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
      max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
      value={(columnFilterValue as [number, number])?.[0] ?? ""}
      onChange={(value) =>
        column.setFilterValue((old: [number, number]) => [value, old?.[1]])
      }
      placeholder={`Range (${column.getFacetedMinMaxValues()?.[0] ?? ""} - ${
        column.getFacetedUniqueValues().size
      })`}
      className="w-36 text-sm shadow"
    />
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: string) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 text-sm shadow"
        list={column.id + "list"}
      />
    </>
  )
}
