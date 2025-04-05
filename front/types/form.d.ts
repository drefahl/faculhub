import type { FieldValues } from "react-hook-form"

export interface InputProps<T extends FieldValues> {
  name: Path<T>
  placeholder?: string
  label?: string
  description?: string
  disabled?: boolean
  className?: string
}
