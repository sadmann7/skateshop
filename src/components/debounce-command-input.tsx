"use client"

import * as React from "react"

import { CommandInput } from "./ui/command"

interface DebounceCommandInputProps
  extends React.ComponentProps<typeof CommandInput> {
  debounce?: number
}

export function DebounceCommandInput({
  onValueChange,
  debounce = 500,
  ...props
}: DebounceCommandInputProps) {
  const [value, setValue] = React.useState(props.value ?? "")
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    setValue(props.value ?? "")
  }, [props.value])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, debounce)

    return () => {
      clearTimeout(timeout)
    }
  }, [value, debounce])

  React.useEffect(() => {
    if (debouncedValue !== props.value) {
      onValueChange?.(debouncedValue)
    }
  }, [debouncedValue, onValueChange, props.value])

  return (
    <CommandInput
      {...props}
      value={value}
      onValueChange={(value) => setValue(value)}
    />
  )
}
