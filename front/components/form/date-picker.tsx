"use client"

import { cn } from "@/lib/utils"
import type { InputProps } from "@/types/form"
import { format } from "date-fns"
import { useState } from "react"
import { type FieldValues, useFormContext } from "react-hook-form"
import type { CalendarProps } from "../ui/calendar"
import { DatePicker as DatePickerComponent } from "../ui/date-picker"
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

interface DatePickerProps<T extends FieldValues> extends Omit<InputProps<T>, "placeholder"> {
  calendar?: CalendarProps
}

export function DatePicker<T extends FieldValues>({ name, calendar, ...rest }: DatePickerProps<T>) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const [selected, setSelected] = useState<Date>()

        const handleChange = (date: Date | undefined) => {
          setSelected(date)
          field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)
        }

        return (
          <FormItem>
            {rest?.label && <FormLabel>{rest.label}</FormLabel>}

            <DatePickerComponent
              className={cn("w-full", rest?.className)}
              date={selected}
              setDate={handleChange}
              disabled={rest?.disabled}
              format="PPP"
              {...rest}
            />

            {rest?.description && <FormDescription>{rest.description}</FormDescription>}

            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
