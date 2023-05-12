import * as React from "react"

import { CommandInput } from "@/components/ui/command"
import { Input } from "@/components/ui/input"

interface DebouncedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
}

export const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps) => {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce])

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

interface CommandDebouncedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string
  onValueChange: (value: string) => void
  debounce?: number
}

export const CommandDebouncedInput = ({
  value: initialValue,
  onValueChange,
  debounce = 500,
  ...props
}: CommandDebouncedInputProps) => {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onValueChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce])

  return <CommandInput {...props} value={value} onValueChange={onValueChange} />
}
