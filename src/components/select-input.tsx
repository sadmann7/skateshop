import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form"

import { formatEnum } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectInputProps<
  TFieldValues extends FieldValues,
  TContext = unknown
> {
  control: Control<TFieldValues, TContext>
  name: Path<TFieldValues>
  placeholder?: string
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>
  options: PathValue<TFieldValues, Path<TFieldValues>>[]
  label?: string
}

const SelectInput = <TFieldValues extends FieldValues>({
  control,
  name,
  options,
  defaultValue,
  placeholder,
  label,
}: SelectInputProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { value, onChange } }) => (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue
              placeholder={
                defaultValue
                  ? formatEnum(defaultValue)
                  : placeholder ?? "Select an option"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {label && <SelectLabel>{label}</SelectLabel>}
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {formatEnum(option)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
  )
}

export default SelectInput
