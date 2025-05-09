"use client"

import type { InputProps as UiInputProps } from "@/types/form"
import { type FieldValues, useFormContext } from "react-hook-form"
import { EditorClient } from "../ui/editor/client"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

interface EditorProps<T extends FieldValues> extends UiInputProps<T> {}

export function Editor<T extends FieldValues>({ name, ...rest }: EditorProps<T>) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            {rest?.label && <FormLabel>{rest?.label}</FormLabel>}

            <FormControl>
              <EditorClient content={field.value} onChangeContent={field.onChange} />
            </FormControl>

            {rest?.description && <FormDescription>{rest?.description}</FormDescription>}

            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
