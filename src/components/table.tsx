import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type HTMLAttributes,
  type ReactNode,
  type SetStateAction,
} from "react"
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
  type ColumnFiltersState,
  type FilterFn,
  type PaginationState,
  type Row,
  type SortingState,
  type Table,
  type VisibilityState,
} from "@tanstack/react-table"

import { cn } from "@/lib/utils"

interface Props<TData, TValue = unknown> {
  tableTitle?: ReactNode
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  isRefetching?: boolean
  isError?: boolean
  state?: {
    sorting?: SortingState
    columnFilters?: ColumnFiltersState
    pagination?: PaginationState
    columnVisibility?: VisibilityState
    globalFilter?: string
  }
  setSorting?: Dispatch<SetStateAction<SortingState>>
  setColumnFilters?: Dispatch<SetStateAction<ColumnFiltersState>>
  setPagination?: Dispatch<SetStateAction<PaginationState>>
  setColumnVisibility?: Dispatch<SetStateAction<VisibilityState>>
  setGlobalFilter?: Dispatch<SetStateAction<string>>
  manualSorting?: boolean
  manualFiltering?: boolean
  manualPagination?: boolean
  disableGlobalFilter?: boolean
  disableColumnVisibility?: boolean
  itemsPerPageOptions?: number[]
  itemsCount?: number
  headerRowProps?: HTMLAttributes<HTMLTableRowElement>
  headerCellProps?: HTMLAttributes<HTMLTableCellElement>
  bodyRowProps?:
    | ((row: Row<TData>) => HTMLAttributes<HTMLTableRowElement>)
    | HTMLAttributes<HTMLTableRowElement>
  bodyCellProps?: HTMLAttributes<HTMLTableCellElement>
  footerRowProps?: HTMLAttributes<HTMLTableRowElement>
  footerCellProps?: HTMLAttributes<HTMLTableCellElement>
  ascendingSortIndecator?: ReactNode
  descendingSortIndecator?: ReactNode
  rowHoverEffect?: boolean
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value: string, addMeta) => {
  // Rank the item

  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

export function Table<TData, TValue = unknown>(props: Props<TData, TValue>) {
  const { manualFiltering, manualSorting, manualPagination, state } = props

  const [sorting, setSorting] = useState<SortingState>(
    state?.sorting ? [...state?.sorting] : []
  )
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    state?.columnFilters ? [...state?.columnFilters] : []
  )
  const [globalFilter, setGlobalFilter] = useState<string>(
    state?.globalFilter ?? ""
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    state?.columnVisibility ? { ...state?.columnVisibility } : {}
  )
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: state?.pagination?.pageIndex ?? 0,
    pageSize: state?.pagination?.pageSize ?? 10,
  })
  const pagination = useMemo(
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
      columnFilters,
      globalFilter,
      pagination,
      columnVisibility,
    },
    filterFns: { fuzzy: fuzzyFilter },
    manualSorting,
    pageCount:
      manualPagination && props.itemsCount
        ? Math.ceil(
            props.itemsCount /
              (props.state?.pagination?.pageSize ?? pagination.pageSize)
          )
        : undefined,
    manualFiltering,
    manualPagination,
    onSortingChange: props.setSorting ?? setSorting,
    onColumnFiltersChange: props.setColumnFilters ?? setColumnFilters,
    onGlobalFilterChange: props.setGlobalFilter ?? setGlobalFilter,
    onPaginationChange: props.setPagination ?? setPagination,
    onColumnVisibilityChange: props.setColumnVisibility ?? setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    globalFilterFn: fuzzyFilter,
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  })

  return (
    <>
      <div className="flex py-4">
        <h2 className="text-2xl">{props.tableTitle}</h2>
        <div className="ml-auto mr-0 flex gap-4">
          {props.disableGlobalFilter ? null : (
            <div>
              <label htmlFor="global-filter-input" className="sr-only">
                Search any field
              </label>
              <input
                id="global-filter-input"
                placeholder="Search"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-40 border px-4 py-1.5"
              />
            </div>
          )}
          {/* {props.disableColumnVisibility ? null : (
            <div>
              <Popover className="relative inline-block text-left">
                {({ open }) => (
                  <>
                    <Popover.Button className="hover:bg-lowkey inline-flex w-full justify-center border px-4 py-2 text-sm font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                      Show Columns
                      <Icons.chevronDown
                        className="-mr-1 ml-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    {open && (
                      <Popover.Panel
                        className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        static
                      >
                        <div className="px-3 py-1.5">
                          <label>
                            <input
                              {...{
                                type: "checkbox",
                                checked: table.getIsAllColumnsVisible(),
                                onChange:
                                  table.getToggleAllColumnsVisibilityHandler(),
                              }}
                            />
                            {"  "}
                            Toggle All
                          </label>
                        </div>
                        {table.getAllLeafColumns().map((column) => {
                          return (
                            <div key={column.id} className="px-3 py-1.5">
                              <label>
                                <input
                                  {...{
                                    type: "checkbox",
                                    checked: column.getIsVisible(),
                                    onChange:
                                      column.getToggleVisibilityHandler(),
                                  }}
                                />
                                {"  "}
                                {column.id}
                              </label>
                            </div>
                          )
                        })}
                      </Popover.Panel>
                    )}
                  </>
                )}
              </Popover>
            </div>
          )} */}
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-hidden pb-1">
        <table className="border-collapse border">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr {...(props.headerRowProps ?? {})} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className="border-collapse border px-4 pb-3.5 pt-2 text-left text-xs font-bold tracking-wide text-black md:text-sm"
                    {...(props.headerCellProps ?? {})}
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder ? null : (
                      <>
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
                      </>
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
              ? table.getRowModel().rows.map((row) => {
                  return (
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
                            className="border-collapse border p-2"
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
                  )
                })
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
      <div className="mt-5 flex w-full flex-wrap items-center gap-2 text-sm md:text-base">
        <button
          aria-label="paginate back by 1 page"
          className="grid aspect-square w-8 place-items-center border border-neutral-500 enabled:transition-opacity enabled:hover:opacity-90 enabled:active:opacity-100 disabled:cursor-not-allowed"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          aria-label="paginate forward by 1 page"
          className="grid aspect-square w-8 place-items-center border border-neutral-500 enabled:transition-opacity enabled:hover:opacity-90 enabled:active:opacity-100 disabled:cursor-not-allowed"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="hidden items-center gap-1 md:flex">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="w-16 border p-1"
          />
        </span>
        <select
          className="py-1"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {(props.itemsPerPageOptions ?? [10, 20, 30, 40]).map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

const Filter = <TData, TValue = unknown>({
  column,
  table,
}: {
  column: Column<TData, TValue>
  table: Table<TData>
}) => {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = useMemo(
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
      placeholder={`Range ${
        column.getFacetedMinMaxValues()?.[0]
          ? `(${column.getFacetedMinMaxValues()?.[0] ?? 0}`
          : ""
      } ~ ${
        column.getFacetedMinMaxValues()?.[1]
          ? `${column.getFacetedMinMaxValues()?.[1] ?? 0})`
          : ""
      })`}
      className={"mt-1.5 w-36 border text-xs shadow md:text-sm"}
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
        className={"mt-1.5 w-36 border text-xs shadow md:text-sm"}
        list={column.id + "list"}
      />
    </>
  )
}

// A debounced input react component
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
