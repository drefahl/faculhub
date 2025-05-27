"use client"

import type { Option } from "@/types"
import type { InputProps } from "@/types/form"
import { type VariantProps, cva } from "class-variance-authority"
import { type FieldValues, useFormContext } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

export const radioGroupStyles = cva("flex", {
  variants: {
    variant: {
      inline: "flex-row space-x-3",
      column: "flex-col space-y-1",
    },
  },
  defaultVariants: {
    variant: "column",
  },
})

interface RadioProps<T extends FieldValues>
  extends Omit<InputProps<T>, "placeholder">,
    VariantProps<typeof radioGroupStyles> {
  options: Option[]
}

export function Radio<T extends FieldValues>({ name, variant, ...rest }: RadioProps<T>) {
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
            <RadioGroup
              className={radioGroupStyles({ variant })}
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={rest?.disabled}
            >
              {rest?.options.map((option) => (
                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={option.value.toString()} />
                  </FormControl>

                  <FormLabel>{option.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>

          {rest?.description && <FormDescription>{rest?.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
