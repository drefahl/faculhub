"use client"

import type { Option } from "@/types"
import type { InputProps } from "@/types/form"
import { type FieldValues, useFormContext } from "react-hook-form"
import { Checkbox as UiCheckbox } from "../ui/checkbox"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

interface CheckBoxProps<T extends FieldValues> extends Omit<InputProps<T>, "placeholder"> {
  options: Option[]
}

export function Checkbox<T extends FieldValues>({ name, options, ...rest }: CheckBoxProps<T>) {
  const { control } = useFormContext()

  return (
    <FormField
      key={name}
      control={control}
      name={name}
      render={() => (
        <FormItem>
          {rest?.label && <FormLabel>{rest.label}</FormLabel>}
          {rest?.description && <FormDescription>{rest.description}</FormDescription>}

          {options.map((item) => (
            <FormField
              key={item.value}
              control={control}
              name={name}
              render={({ field }) => (
                <FormItem key={item.value} className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <UiCheckbox
                      checked={field.value?.includes(item.value)}
                      disabled={rest?.disabled}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.value && field.onChange([...field.value, item.value])
                          : field.onChange(field.value?.filter((value: any) => value !== item.value))
                      }}
                    />
                  </FormControl>

                  <FormLabel className="font-normal">{item.label}</FormLabel>
                </FormItem>
              )}
            />
          ))}

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
