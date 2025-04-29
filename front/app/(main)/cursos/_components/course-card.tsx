import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { Disciplina } from "@/types/grade"
import { ExternalLink } from "lucide-react"

interface CourseCardProps {
  disciplina: Disciplina
  allDisciplinas: Disciplina[]
  isHighlighted: boolean
  onPrerequisiteClick: (code: string) => void
  isSelectionModeActive?: boolean
  isSelected?: boolean
  onToggleSelection?: (code: string) => void
}

export function CourseCard({
  disciplina,
  allDisciplinas,
  isHighlighted,
  onPrerequisiteClick,
  isSelectionModeActive = false,
  isSelected = false,
  onToggleSelection,
}: CourseCardProps) {
  const getPrerequisiteNames = (codes: string[] | undefined) => {
    if (!codes) return []
    return codes.map((code) => {
      const discipline = allDisciplinas.find((d) => d.codigo === code)
      return {
        code,
        name: discipline ? discipline.nome : code,
      }
    })
  }

  const prerequisiteNames = getPrerequisiteNames(disciplina.prerequisitos)
  const corequisiteNames = getPrerequisiteNames(disciplina.corequisitos)

  return (
    <Card
      id={`course-${disciplina.codigo}`}
      className={cn(
        "transition-all duration-300 border",
        isHighlighted ? "ring-2 ring-primary shadow-lg scale-[1.02]" : "",
        isSelected ? "border-primary bg-primary/5" : "",
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            {isSelectionModeActive && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelection?.(disciplina.codigo)}
                className="mt-1"
              />
            )}
            <CardTitle className="text-base font-medium">{disciplina.nome}</CardTitle>
          </div>
          <Badge variant="outline">{disciplina.codigo}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Carga Total:</span> {disciplina.cargaHoraria.total}h
          </div>
        </div>

        {(prerequisiteNames.length > 0 || corequisiteNames.length > 0) && (
          <div className="space-y-2 pt-2 border-t">
            {prerequisiteNames.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Pré-requisitos:</p>
                <div className="flex flex-wrap gap-1">
                  {prerequisiteNames.map((prereq) => (
                    <Badge
                      key={prereq.code}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80 flex items-center gap-1 transition-colors"
                      onClick={() => onPrerequisiteClick(prereq.code)}
                    >
                      {prereq.code}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {corequisiteNames.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Co-requisitos:</p>
                <div className="flex flex-wrap gap-1">
                  {corequisiteNames.map((coreq) => (
                    <Badge
                      key={coreq.code}
                      variant="outline"
                      className="cursor-pointer hover:bg-muted flex items-center gap-1 transition-colors"
                      onClick={() => onPrerequisiteClick(coreq.code)}
                    >
                      {coreq.code}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
