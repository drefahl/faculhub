"use client"

import { cn } from "@/lib/utils"
import type { InputProps } from "@/types/form"
import { type FieldValues, useFormContext } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Switch as UiSwitch } from "../ui/switch"

interface SwitchProps<T extends FieldValues> extends Omit<InputProps<T>, "placeholder"> {}

export function Switch<T extends FieldValues>({ name, ...rest }: SwitchProps<T>) {
  const { control } = useFormContext()

  return (
    <FormField
      key={name}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", rest?.className)}>
          {rest?.label && <FormLabel>{rest?.label}</FormLabel>}
          {rest?.description && <FormDescription>{rest?.description}</FormDescription>}

          <FormControl>
            <UiSwitch checked={field.value} onCheckedChange={field.onChange} disabled={rest?.disabled} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
