"use client"

import type { Option } from "@/types"
import type { InputProps } from "@/types/form"
import { type FieldValues, useFormContext } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select as UiSelect } from "../ui/select"

interface BaseSelectProps<T extends FieldValues> extends InputProps<T> {}

interface OptionsProps {
  options: Option[]
  children?: never
}

interface ChildrenProps {
  children: React.ReactNode
  options?: never
}

type SelectProps<T extends FieldValues> = BaseSelectProps<T> & (OptionsProps | ChildrenProps)

export function Select<T extends FieldValues>({ name, options, children, ...rest }: SelectProps<T>) {
  const { control } = useFormContext()

  return (
    <FormField
      key={name}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {rest?.label && <FormLabel>{rest?.label}</FormLabel>}

          <UiSelect onValueChange={field.onChange} defaultValue={field.value?.toString()} disabled={rest?.disabled}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={rest.placeholder || "Selecione"} />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {children
                ? children
                : options?.map((option) => (
                    <SelectItem key={option.value.toString()} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
            </SelectContent>
          </UiSelect>

          {rest?.description && <FormDescription>{rest?.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
