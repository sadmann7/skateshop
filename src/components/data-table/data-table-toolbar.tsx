"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { type Table } from "@tanstack/react-table"
import dayjs from "dayjs"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { DatePickerWithRange } from "@/components/date-range-picker"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex w-full items-center justify-between overflow-auto">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* <DatePickerWithRange /> */}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
