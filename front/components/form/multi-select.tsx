"use client"

import type { InputProps } from "@/types/form"
import { type FieldValues, useFormContext } from "react-hook-form"
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { MultiSelect as UiMultiSelect, type MultiSelectProps as UiMultiSelectProps } from "../ui/multi-select"

type MultiSelectProps<T extends FieldValues> = Omit<UiMultiSelectProps, "onValueChange"> & InputProps<T>

export function MultiSelect<T extends FieldValues>({ name, options, children, ...rest }: MultiSelectProps<T>) {
  const { control } = useFormContext()

  return (
    <FormField
      key={name}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {rest?.label && <FormLabel>{rest?.label}</FormLabel>}

          <UiMultiSelect {...rest} options={options} onValueChange={field.onChange} defaultValue={field.value} />

          {rest?.description && <FormDescription>{rest?.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
