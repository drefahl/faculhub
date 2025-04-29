"use client"

import type { InputProps } from "@/types/form"
import type { TextareaHTMLAttributes } from "react"
import { type FieldValues, useFormContext } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Textarea as UiTextarea } from "../ui/textarea"

interface TextareaProps<T extends FieldValues>
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name">,
    InputProps<T> {
  name: InputProps<T>["name"]
}

export function Textarea<T extends FieldValues>({ name, ...rest }: TextareaProps<T>) {
  const { control } = useFormContext()

  return (
    <FormField
      key={name}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {rest?.label && <FormLabel>{rest?.label}</FormLabel>}

          <FormControl>
            <UiTextarea className="resize-none" {...field} {...rest} />
          </FormControl>

          {rest?.description && <FormDescription>{rest?.description}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
