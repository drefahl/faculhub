"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { Disciplina, GradeCurricular } from "@/types/grade"
import { Calendar, CheckSquare, ExternalLink, Search, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import WeeklySchedule from "./weekly-schedule"

interface CurriculumGridProps {
  curriculumData: GradeCurricular
}

function findMaxValues(disciplinas: Disciplina[]) {
  return disciplinas.reduce(
    (acc, disciplina) => {
      return {
        total: Math.max(acc.total, disciplina.cargaHoraria.total),
      }
    },
    { total: 0 },
  )
}

function calculateSemesterWorkload(disciplinas: Disciplina[]) {
  return disciplinas.reduce(
    (acc, disciplina) => {
      return {
        total: acc.total + disciplina.cargaHoraria.total,
      }
    },
    { total: 0 },
  )
}

export default function CurriculumGrid({ curriculumData }: CurriculumGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSemesters, setSelectedSemesters] = useState<number[]>([])
  const [highlightedCourse, setHighlightedCourse] = useState<string | null>(null)
  const [selectedDisciplinas, setSelectedDisciplinas] = useState<string[]>([])
  const [isSelectionModeActive, setIsSelectionModeActive] = useState(false)
  const [showWeeklySchedule, setShowWeeklySchedule] = useState(false)

  const allDisciplinas = useMemo(() => {
    return curriculumData.semestres.flatMap((s) => s.disciplinas)
  }, [curriculumData])

  const maxValues = useMemo(() => findMaxValues(allDisciplinas), [allDisciplinas])

  const [totalWorkloadRange, setTotalWorkloadRange] = useState<[number, number]>([0, maxValues.total])

  useEffect(() => {
    const newMaxValues = findMaxValues(allDisciplinas)
    setTotalWorkloadRange([totalWorkloadRange[0], newMaxValues.total])

    setSelectedDisciplinas([])
  }, [curriculumData])

  const semesters = useMemo(() => {
    return curriculumData.semestres.map((semestre) => semestre.numero)
  }, [curriculumData])

  const findDisciplinaByCode = (code: string) => {
    return allDisciplinas.find((d) => d.codigo === code) || null
  }

  const toggleSemester = (semesterNumber: number) => {
    setSelectedSemesters((prev) => {
      if (prev.includes(semesterNumber)) {
        return prev.filter((s) => s !== semesterNumber)
      }
      return [...prev, semesterNumber]
    })
  }

  const selectAllSemesters = () => {
    if (selectedSemesters.length === semesters.length) {
      setSelectedSemesters([])
    } else {
      setSelectedSemesters([...semesters])
    }
  }

  const filteredSemesters = useMemo(() => {
    return curriculumData.semestres
      .filter((semestre) => {
        if (selectedSemesters.length === 0) return true
        return selectedSemesters.includes(semestre.numero)
      })
      .map((semestre) => {
        const filteredDisciplinas = semestre.disciplinas.filter((disciplina) => {
          const searchLower = searchTerm.toLowerCase()
          const matchesSearch =
            disciplina.codigo.toLowerCase().includes(searchLower) || disciplina.nome.toLowerCase().includes(searchLower)

          const matchesTotalWorkload =
            disciplina.cargaHoraria.total >= totalWorkloadRange[0] &&
            disciplina.cargaHoraria.total <= totalWorkloadRange[1]

          return matchesSearch && matchesTotalWorkload
        })
        return { ...semestre, disciplinas: filteredDisciplinas }
      })
      .filter((semestre) => semestre.disciplinas.length > 0)
  }, [curriculumData, searchTerm, selectedSemesters, totalWorkloadRange])

  const allVisibleDisciplinas = useMemo(() => {
    return filteredSemesters.flatMap((semestre) => semestre.disciplinas.map((d) => d.codigo))
  }, [filteredSemesters])

  const handlePrerequisiteClick = (code: string) => {
    setHighlightedCourse(code)

    setTimeout(() => {
      const element = document.getElementById(`course-${code}`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }

  const toggleDisciplinaSelection = (codigo: string) => {
    setSelectedDisciplinas((prev) => {
      if (prev.includes(codigo)) {
        return prev.filter((c) => c !== codigo)
      }
      return [...prev, codigo]
    })
  }

  const selectAllVisibleDisciplinas = () => {
    if (selectedDisciplinas.length === allVisibleDisciplinas.length) {
      setSelectedDisciplinas([])
    } else {
      setSelectedDisciplinas(allVisibleDisciplinas)
    }
  }

  const selectedWorkload = useMemo(() => {
    const selectedDisciplinasObjects = allDisciplinas.filter((d) => selectedDisciplinas.includes(d.codigo))
    return calculateSemesterWorkload(selectedDisciplinasObjects)
  }, [selectedDisciplinas, allDisciplinas])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {/* Barra de pesquisa e modo de seleção */}
        <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-2 w-full lg:w-auto">
            <Button
              variant={isSelectionModeActive ? "default" : "outline"}
              size="sm"
              onClick={() => setIsSelectionModeActive(!isSelectionModeActive)}
              className="flex items-center gap-1 w-full lg:w-fit"
            >
              <CheckSquare className="h-4 w-4 mr-1" />
              {isSelectionModeActive ? "Desativar Seleção" : "Ativar Seleção"}
            </Button>
            {isSelectionModeActive && (
              <Button variant="outline" size="sm" onClick={selectAllVisibleDisciplinas} className="w-full lg:w-fit">
                {selectedDisciplinas.length === allVisibleDisciplinas.length ? "Desmarcar Todas" : "Selecionar Todas"}
              </Button>
            )}
            {selectedDisciplinas.length > 0 && (
              <Button
                variant={showWeeklySchedule ? "default" : "outline"}
                size="sm"
                onClick={() => setShowWeeklySchedule(!showWeeklySchedule)}
                className="flex items-center gap-1 w-full lg:w-fit"
              >
                <Calendar className="h-4 w-4 mr-1" />
                {showWeeklySchedule ? "Ocultar Horário" : "Criar Horário"}
              </Button>
            )}
          </div>
        </div>

        {/* Painel de disciplinas selecionadas */}
        {isSelectionModeActive && (
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Disciplinas Selecionadas ({selectedDisciplinas.length})</CardTitle>
                {selectedDisciplinas.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDisciplinas([])} className="h-8">
                    <X className="h-4 w-4 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedDisciplinas.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-muted p-3 rounded-md flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Total:</span> {selectedWorkload.total}h
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Disciplinas:</span> {selectedDisciplinas.length}
                    </div>
                  </div>

                  <div className="max-h-32 overflow-y-auto">
                    <div className="flex flex-wrap gap-1">
                      {selectedDisciplinas.map((codigo) => {
                        const disciplina = findDisciplinaByCode(codigo)
                        return (
                          <Badge
                            key={codigo}
                            variant="secondary"
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => toggleDisciplinaSelection(codigo)}
                          >
                            {disciplina?.nome || codigo}
                            <X className="h-3 w-3 ml-1" />
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2 text-muted-foreground">
                  Selecione disciplinas para calcular a carga horária total
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Componente de Horário Semanal */}
        {showWeeklySchedule && selectedDisciplinas.length > 0 && (
          <WeeklySchedule selectedDisciplinas={selectedDisciplinas} allDisciplinas={allDisciplinas} />
        )}

        {/* Seleção de semestres */}
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Selecionar Semestres</h3>
            <Button variant="outline" size="sm" onClick={selectAllSemesters} className="h-8">
              {selectedSemesters.length === semesters.length ? "Desmarcar Todos" : "Selecionar Todos"}
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {semesters.map((semester) => (
              <div key={semester} className="flex items-center space-x-2">
                <Checkbox
                  id={`semester-${semester}`}
                  checked={selectedSemesters.includes(semester)}
                  onCheckedChange={() => toggleSemester(semester)}
                />
                <Label htmlFor={`semester-${semester}`} className="text-sm">
                  {semester}º Semestre
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filteredSemesters.length > 0 ? (
        <div className="space-y-8">
          {filteredSemesters.map((semestre) => {
            const semesterWorkload = calculateSemesterWorkload(semestre.disciplinas)
            return (
              <div key={semestre.numero} className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h2 className="text-xl font-semibold">{semestre.numero}º Semestre</h2>
                  <div className="bg-muted p-2 rounded-md flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Total:</span> {semesterWorkload.total}h
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Disciplinas:</span> {semestre.disciplinas.length}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {semestre.disciplinas.map((disciplina) => (
                    <CourseCard
                      key={disciplina.codigo}
                      disciplina={disciplina}
                      allDisciplinas={allDisciplinas}
                      isHighlighted={disciplina.codigo === highlightedCourse}
                      onPrerequisiteClick={handlePrerequisiteClick}
                      isSelectionModeActive={isSelectionModeActive}
                      isSelected={selectedDisciplinas.includes(disciplina.codigo)}
                      onToggleSelection={toggleDisciplinaSelection}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nenhuma disciplina encontrada com os critérios selecionados.</p>
        </div>
      )}

      {curriculumData.resumo && <SummaryCard resumo={curriculumData.resumo} />}
    </div>
  )
}

interface CourseCardProps {
  disciplina: Disciplina
  allDisciplinas: Disciplina[]
  isHighlighted: boolean
  onPrerequisiteClick: (code: string) => void
  isSelectionModeActive?: boolean
  isSelected?: boolean
  onToggleSelection?: (code: string) => void
}

function CourseCard({
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

interface SummaryCardProps {
  resumo: {
    cargaTeorica: number
    cargaPratica: number
    complementares: number
    optativasMinima: number
    estagio: number
    tcc: number
    extensaoPesquisa: number
    total: number
  }
}

function SummaryCard({ resumo }: SummaryCardProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Resumo da Grade Curricular</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-muted-foreground">Teórica</p>
            <p className="text-xl font-medium">{resumo.cargaTeorica}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">Prática</p>
            <p className="text-xl font-medium">{resumo.cargaPratica}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">Complementares</p>
            <p className="text-xl font-medium">{resumo.complementares}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">Optativas (mín)</p>
            <p className="text-xl font-medium">{resumo.optativasMinima}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">Estágio</p>
            <p className="text-xl font-medium">{resumo.estagio}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">TCC</p>
            <p className="text-xl font-medium">{resumo.tcc}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">Extensão/Pesquisa</p>
            <p className="text-xl font-medium">{resumo.extensaoPesquisa}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total</p>
            <p className="text-xl font-medium">{resumo.total}h</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
