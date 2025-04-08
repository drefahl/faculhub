"use client"

import { cn } from "@/lib/utils"
import type { InputProps as UiInputProps } from "@/types/form"
import { type FieldValues, useFormContext } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { PasswordInput as UiPasswordInput } from "../ui/password-input"
import type { PasswordInputProps } from "../ui/password-input"

type MergedPasswordInputProps = Omit<PasswordInputProps, "name" | "value" | "onChange">

interface PasswordFieldProps<T extends FieldValues> extends UiInputProps<T>, MergedPasswordInputProps {}

export function PasswordInput<T extends FieldValues>({ name, ...rest }: PasswordFieldProps<T>) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {rest.label && <FormLabel>{rest.label}</FormLabel>}

          <FormControl>
            <div className={cn("relative", rest.className)}>
              <UiPasswordInput placeholder={rest.placeholder} {...field} {...rest} />
            </div>
          </FormControl>

          {rest.description && <FormDescription>{rest.description}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
