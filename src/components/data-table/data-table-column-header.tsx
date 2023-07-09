import { type Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Sort column"
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <Icons.arrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
            ) : column.getIsSorted() === "asc" ? (
              <Icons.arrowUp className="ml-2 h-4 w-4" aria-hidden="true" />
            ) : (
              <Icons.chevronUpDown
                className="ml-2 h-4 w-4"
                aria-hidden="true"
              />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            aria-label="Sort column ascending"
            onClick={() => column.toggleSorting(false)}
          >
            <Icons.arrowUp
              className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
              aria-hidden="true"
            />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem
            aria-label="Sort column descending"
            onClick={() => column.toggleSorting(true)}
          >
            <Icons.arrowDown
              className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
              aria-hidden="true"
            />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            aria-label="Remove sorting"
            onClick={() => column.toggleVisibility(false)}
          >
            <Icons.hide
              className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
              aria-hidden="true"
            />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
