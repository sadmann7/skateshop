"use client"

import * as React from "react"
import type { Option } from "@/types"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Command as CommandPrimitive } from "cmdk"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"

interface MultiSelectProps {
  selected: Option[] | null
  setSelected: React.Dispatch<React.SetStateAction<Option[] | null>>
  onChange?: (value: Option[] | null) => void
  placeholder?: string
  options: Option[]
}

export function MultiSelect({
  selected,
  setSelected,
  onChange,
  placeholder = "Select options",
  options,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  // Register as input field to be used in react-hook-form
  React.useEffect(() => {
    if (onChange) onChange(selected?.length ? selected : null)
  }, [onChange, selected])

  const handleSelect = React.useCallback(
    (option: Option) => {
      setSelected((prev) => [...(prev ?? []), option])
    },
    [setSelected]
  )

  const handleRemove = React.useCallback(
    (option: Option) => {
      setSelected((prev) => prev?.filter((item) => item !== option) ?? [])
    },
    [setSelected]
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!inputRef.current) return

      if (event.key === "Backspace" || event.key === "Delete") {
        setSelected((prev) => prev?.slice(0, -1) ?? [])
      }

      // Blur input on escape
      if (event.key === "Escape") {
        inputRef.current.blur()
      }
    },
    [setSelected]
  )

  // Memoize filtered options to avoid unnecessary re-renders
  const filteredOptions = React.useMemo(() => {
    return options.filter((option) => {
      if (selected?.find((item) => item.value === option.value)) return false

      if (query.length === 0) return true

      return option.label.toLowerCase().includes(query.toLowerCase())
    })
  }, [options, query, selected])

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected?.map((option) => {
            return (
              <Badge
                key={option.value}
                variant="secondary"
                className="rounded hover:bg-secondary"
              >
                {option.label}
                <Button
                  aria-label="Remove option"
                  size="sm"
                  className="ml-2 h-auto bg-transparent p-0 text-primary hover:bg-transparent hover:text-destructive"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      e.stopPropagation()
                      handleRemove(option)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleRemove(option)}
                >
                  <Cross2Icon className="h-3 w-3" aria-hidden="true" />
                </Button>
              </Badge>
            )
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            placeholder={placeholder}
            className="flex-1 bg-transparent px-1 py-0.5 outline-none placeholder:text-muted-foreground"
            value={query}
            onValueChange={setQuery}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
          />
        </div>
      </div>
      <div className="relative z-50 mt-2">
        {open && filteredOptions.length > 0 ? (
          <div className="absolute top-0 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {filteredOptions.map((option) => {
                return (
                  <CommandItem
                    key={option.value}
                    className="px-2 py-1.5 text-sm"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onSelect={() => {
                      handleSelect(option)
                      setQuery("")
                    }}
                  >
                    {option.label}
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
