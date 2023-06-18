"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"

interface MultiSelectProps<TData extends { value: string; label: string }> {
  options: TData[]
}

export function MultiSelect<TData extends { value: string; label: string }>({
  options,
}: MultiSelectProps<TData>) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<TData[]>(
    options[0] ? [options[0]] : []
  )
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = React.useCallback((option: TData) => {
    setSelected((prev) => {
      const newSelected = [...prev]
      const index = newSelected.findIndex(
        (selected) => selected.value === option.value
      )
      newSelected.splice(index, 1)
      return newSelected
    })
  }, [])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev]
              newSelected.pop()
              return newSelected
            })
          }
        }
        if (e.key === "Escape") {
          input.blur()
        }
      }
    },
    []
  )

  const selectables = React.useMemo(() => {
    return options.filter(
      (option) => !selected.find((selected) => selected.value === option.value)
    )
  }, [options, selected])

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((framework) => {
            return (
              <Badge key={framework.value} variant="secondary">
                {framework.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(framework)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(framework)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select frameworks..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute top-0 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((framework) => {
                return (
                  <CommandItem
                    key={framework.value}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onSelect={(value) => {
                      setInputValue("")
                      setSelected((prev) => [...prev, framework])
                    }}
                  >
                    {framework.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  )
}
