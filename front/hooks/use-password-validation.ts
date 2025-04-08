"use client"

import { useCallback, useState } from "react"

export type PasswordRequirement = {
  id: string
  label: string
  validator: (password: string) => boolean
}

export type PasswordValidationOptions = {
  minLength?: number
  requireUppercase?: boolean
  requireLowercase?: boolean
  requireNumbers?: boolean
  requireSpecialChars?: boolean
  customRequirements?: PasswordRequirement[]
}

export type PasswordStrength = "empty" | "weak" | "medium" | "strong" | "very-strong"

export type PasswordValidationResult = {
  strength: PasswordStrength
  score: number
  maxScore: number
  requirements: {
    id: string
    label: string
    valid: boolean
  }[]
  isValid: boolean
}

export function usePasswordValidation(
  options: PasswordValidationOptions = {},
): [(password: string) => PasswordValidationResult, (password: string) => boolean] {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
    customRequirements = [],
  } = options

  const getDefaultRequirements = useCallback((): PasswordRequirement[] => {
    const requirements: PasswordRequirement[] = []

    if (minLength > 0) {
      requirements.push({
        id: "length",
        label: `Pelo menos ${minLength} caracteres`,
        validator: (password) => password.length >= minLength,
      })
    }

    if (requireUppercase) {
      requirements.push({
        id: "uppercase",
        label: "Pelo menos uma letra maiúscula",
        validator: (password) => /[A-Z]/.test(password),
      })
    }

    if (requireLowercase) {
      requirements.push({
        id: "lowercase",
        label: "Pelo menos uma letra minúscula",
        validator: (password) => /[a-z]/.test(password),
      })
    }

    if (requireNumbers) {
      requirements.push({
        id: "number",
        label: "Pelo menos um número",
        validator: (password) => /[0-9]/.test(password),
      })
    }

    if (requireSpecialChars) {
      requirements.push({
        id: "special",
        label: "Pelo menos um caractere especial",
        validator: (password) => /[^A-Za-z0-9]/.test(password),
      })
    }

    return [...requirements, ...customRequirements]
  }, [minLength, requireUppercase, requireLowercase, requireNumbers, requireSpecialChars, customRequirements])

  const [requirements] = useState<PasswordRequirement[]>(getDefaultRequirements())

  const validatePassword = useCallback(
    (password: string): PasswordValidationResult => {
      if (!password) {
        return {
          strength: "empty",
          score: 0,
          maxScore: requirements.length,
          requirements: requirements.map((req) => ({ ...req, valid: false })),
          isValid: false,
        }
      }

      const validatedRequirements = requirements.map((req) => ({
        id: req.id,
        label: req.label,
        valid: req.validator(password),
      }))

      const score = validatedRequirements.filter((req) => req.valid).length
      const isValid = score === requirements.length

      let strength: PasswordStrength = "weak"
      const strengthPercentage = (score / requirements.length) * 100

      if (strengthPercentage === 0) {
        strength = "empty"
      } else if (strengthPercentage < 40) {
        strength = "weak"
      } else if (strengthPercentage < 80) {
        strength = "medium"
      } else if (strengthPercentage < 100) {
        strength = "strong"
      } else {
        strength = "very-strong"
      }

      return {
        strength,
        score,
        maxScore: requirements.length,
        requirements: validatedRequirements,
        isValid,
      }
    },
    [requirements],
  )

  const isPasswordValid = useCallback(
    (password: string): boolean => {
      return validatePassword(password).isValid
    },
    [validatePassword],
  )

  return [validatePassword, isPasswordValid]
}
