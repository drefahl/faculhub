"use client"

import type { InputProps as UiInputProps } from "@/types/form"
import { type FieldValues, useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import {
  MarkdownEditor as UiMarkdownEditor,
  type MarkdownEditorProps as UiMarkdownEditorProps,
} from "../ui/markdown-editor"

interface MarkdownEditorProps<T extends FieldValues> extends UiInputProps<T>, Omit<UiMarkdownEditorProps, "onChange"> {}

export function MarkdownEditor<T extends FieldValues>({ name, ...rest }: MarkdownEditorProps<T>) {
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
              <UiMarkdownEditor initialValue={field?.value ?? ""} {...rest} {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
