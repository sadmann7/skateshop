"use client"

import { usePathname, useRouter } from "next/navigation"
import { type Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { Icons } from "@/components/icons"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Button
          aria-label="Add new item"
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Icons.addCircle className="mr-2 h-4 w-4" />
          New
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
