"use client"

import { cn } from "@/lib/utils"
import type { InputProps as UiInputProps } from "@/types/form"
import { Eye, EyeOffIcon } from "lucide-react"
import { useState } from "react"
import { type FieldValues, useFormContext } from "react-hook-form"
import { Button } from "../ui/button"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input as UiInput } from "../ui/input"

interface InputProps<T extends FieldValues> extends UiInputProps<T> {
  type?: "text" | "email" | "password" | "number" | "tel" | "url"
}

export function Input<T extends FieldValues>({ name, ...rest }: InputProps<T>) {
  const [showPassword, setShowPassword] = useState(false)

  const { control } = useFormContext()

  const isPassword = rest?.type === "password"

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            {rest?.label && <FormLabel>{rest?.label}</FormLabel>}

            <FormControl>
              <div className={cn("relative", rest?.className)}>
                <UiInput {...rest} {...field} type={isPassword && showPassword ? "text" : rest?.type || "text"} />

                {isPassword && (
                  <Button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    variant="ghost"
                    className="hover:bg-transparent m-0 absolute right-0 top-0"
                  >
                    {!showPassword ? (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                )}
              </div>
            </FormControl>

            {rest?.description && <FormDescription>{rest?.description}</FormDescription>}

            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
