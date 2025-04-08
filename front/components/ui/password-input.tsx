"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordStrength } from "@/components/ui/password-strength"
import { type PasswordValidationOptions, usePasswordValidation } from "@/hooks/use-password-validation"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { forwardRef, useState } from "react"

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  validationOptions?: PasswordValidationOptions
  showStrength?: boolean
  showRequirements?: boolean
  onValidationChange?: (isValid: boolean) => void
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      validationOptions,
      showStrength = true,
      showRequirements = true,
      onValidationChange,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState("")
    const [validatePassword, isPasswordValid] = usePasswordValidation(validationOptions)
    const validationResult = validatePassword(password)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
      onChange?.(e)

      if (onValidationChange) {
        onValidationChange(isPasswordValid(e.target.value))
      }
    }

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            className={cn("pr-10", className)}
            ref={ref}
            value={password}
            onChange={handleChange}
            {...props}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            )}
            <span className="sr-only">{showPassword ? "Esconder senha" : "Mostrar senha"}</span>
          </Button>
        </div>

        {showStrength && password.length > 0 && (
          <PasswordStrength result={validationResult} showRequirements={showRequirements} />
        )}
      </div>
    )
  },
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
