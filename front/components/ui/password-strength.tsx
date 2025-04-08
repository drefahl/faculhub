import type { PasswordValidationResult } from "@/hooks/use-password-validation"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle } from "lucide-react"

interface PasswordStrengthProps {
  result: PasswordValidationResult

  showRequirements?: boolean
  className?: string
}

export function PasswordStrength({ result, showRequirements = true, className }: PasswordStrengthProps) {
  const { strength, score, maxScore, requirements } = result

  const getStrengthColor = () => {
    switch (strength) {
      case "empty":
        return "bg-gray-200 dark:bg-gray-700"
      case "weak":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "strong":
        return "bg-green-500"
      case "very-strong":
        return "bg-emerald-500"
      default:
        return "bg-gray-200 dark:bg-gray-700"
    }
  }

  const getStrengthLabel = () => {
    switch (strength) {
      case "empty":
        return "Vazio"
      case "weak":
        return "Fraca"
      case "medium":
        return "Média"
      case "strong":
        return "Forte"
      case "very-strong":
        return "Muito Forte"
      default:
        return "Vazio"
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>Força da senha: {getStrengthLabel()}</span>
          <span>
            {score}/{maxScore}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={cn("h-full rounded-full transition-all", getStrengthColor())}
            style={{ width: `${(score / maxScore) * 100}%` }}
          />
        </div>
      </div>

      {showRequirements && (
        <ul className="space-y-1 text-sm">
          {requirements.map((req) => (
            <li key={req.id} className="flex items-center gap-2">
              {req.valid ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={cn(req.valid ? "text-foreground" : "text-muted-foreground")}>{req.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
