"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Disciplina } from "@/types/grade"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import { Download, Plus, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

const TIME_SLOTS = [
  "15:20 - 16:05",
  "16:05 - 16:50",
  "17:45 - 18:30",
  "18:30 - 19:15",
  "19:15 - 20:00",
  "20:15 - 21:00",
  "21:00 - 21:45",
  "21:45 - 22:30",
]

const DAYS_OF_WEEK = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]

interface ScheduledClass {
  id: string
  disciplinaId: string
  disciplinaNome: string
  disciplinaCodigo: string
  day: string
  startTime: string
  endTime: string
  color: string
}

interface WeeklyScheduleProps {
  selectedDisciplinas: string[]
  allDisciplinas: Disciplina[]
}

const generateColor = () => {
  const colors = [
    "bg-red-100 border-red-300 text-red-800",
    "bg-blue-100 border-blue-300 text-blue-800",
    "bg-green-100 border-green-300 text-green-800",
    "bg-yellow-100 border-yellow-300 text-yellow-800",
    "bg-purple-100 border-purple-300 text-purple-800",
    "bg-pink-100 border-pink-300 text-pink-800",
    "bg-indigo-100 border-indigo-300 text-indigo-800",
    "bg-teal-100 border-teal-300 text-teal-800",
    "bg-orange-100 border-orange-300 text-orange-800",
    "bg-cyan-100 border-cyan-300 text-cyan-800",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

const getStartSlotIndex = (time: string) => TIME_SLOTS.findIndex((slot) => slot.startsWith(time))

const getEndSlotIndex = (time: string) => TIME_SLOTS.findIndex((slot) => slot.endsWith(time))

export function WeeklySchedule({ selectedDisciplinas, allDisciplinas }: WeeklyScheduleProps) {
  const [scheduledClasses, setScheduledClasses] = useState<ScheduledClass[]>([])
  const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState(false)
  const [currentSchedule, setCurrentSchedule] = useState<ScheduledClass | null>(null)
  const [disciplinaColors, setDisciplinaColors] = useState<Record<string, string>>({})
  const [exportFormat, setExportFormat] = useState<"pdf" | "png" | "csv">("pdf")
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [scheduleName, setScheduleName] = useState("Meu Horário")
  const [tempDay, setTempDay] = useState<string>(currentSchedule?.day || "")
  const [tempStartTime, setTempStartTime] = useState<string | undefined>(currentSchedule?.startTime)
  const [tempEndTime, setTempEndTime] = useState<string>(currentSchedule?.endTime || TIME_SLOTS[0].split(" - ")[1])
  const [tempDisciplinaId, setTempDisciplinaId] = useState<string>(currentSchedule?.disciplinaId || "")
  const [isExporting, setIsExporting] = useState<boolean>(false)

  useEffect(() => {
    const newColors: Record<string, string> = {}
    selectedDisciplinas.forEach((id) => {
      if (!disciplinaColors[id]) {
        newColors[id] = generateColor()
      }
    })
    setDisciplinaColors((prev) => ({ ...prev, ...newColors }))
  }, [selectedDisciplinas])

  const handleAddClass = () => {
    setCurrentSchedule(null)
    setTempDisciplinaId("")
    setTempDay("")
    setIsAddClassDialogOpen(true)
  }

  const handleEditClass = (scheduleClass: ScheduledClass) => {
    setCurrentSchedule(scheduleClass)
    setTempDisciplinaId(scheduleClass.disciplinaId)
    setTempDay(scheduleClass.day)
    setTempStartTime(scheduleClass.startTime)
    setTempEndTime(scheduleClass.endTime)
    setIsAddClassDialogOpen(true)
  }

  const hasTimeConflict = (a: ScheduledClass, b: ScheduledClass): boolean =>
    a.day === b.day && a.startTime < b.endTime && b.startTime < a.endTime

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const disciplinaId = form.disciplina.value
    const day = form.day.value
    const startTime = form.startTime.value
    const endTime = form.endTime.value

    const disciplina = allDisciplinas.find((d) => d.codigo === disciplinaId)
    if (!disciplina) return

    const newClass: ScheduledClass = {
      id: currentSchedule?.id || `class-${Date.now()}`,
      disciplinaId,
      disciplinaNome: disciplina.nome,
      disciplinaCodigo: disciplina.codigo,
      day,
      startTime,
      endTime,
      color: disciplinaColors[disciplinaId] || generateColor(),
    }

    const conflict = scheduledClasses.some((c) => hasTimeConflict(c, newClass) && c.id !== newClass.id)

    if (conflict) {
      toast.error("Conflito de horário! Verifique os horários selecionados.", {
        description: "As aulas não podem se sobrepor.",
        duration: 3000,
      })
      return
    }

    if (currentSchedule) {
      setScheduledClasses((prev) => prev.map((c) => (c.id === currentSchedule.id ? newClass : c)))
    } else {
      setScheduledClasses((prev) => [...prev, newClass])
    }

    setIsAddClassDialogOpen(false)
  }

  const handleRemoveClass = (id: string) => {
    setScheduledClasses((prev) => prev.filter((c) => c.id !== id))
  }

  const handleExport = async () => {
    setIsExporting(true)

    const scheduleElement = document.getElementById("schedule-container")
    if (!scheduleElement) {
      console.error("Schedule container not found")
      setIsExporting(false)
      return
    }

    try {
      if (exportFormat === "pdf" || exportFormat === "png") {
        const canvas = await html2canvas(scheduleElement, {
          scale: 1,
          backgroundColor: "#ffffff",
        })

        if (exportFormat === "pdf") {
          const imgData = canvas.toDataURL("image/png")
          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            compress: true,
          })
          const imgWidth = 280
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight)
          pdf.save(`${scheduleName}.pdf`)
        } else {
          const link = document.createElement("a")
          link.download = `${scheduleName}.png`
          link.href = canvas.toDataURL("image/png")
          link.click()
        }
      } else if (exportFormat === "csv") {
        let csvContent = "Dia,Horário Início,Horário Fim,Código,Disciplina\n"
        scheduledClasses.forEach((cls) => {
          csvContent += `${cls.day},${cls.startTime},${cls.endTime},${cls.disciplinaCodigo},${cls.disciplinaNome}\n`
        })
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `${scheduleName}.csv`
        link.click()
      }
      setIsExportDialogOpen(false)
    } catch (error) {
      console.error("Error exporting schedule:", error)
      toast.error("Ocorreu um erro ao exportar o horário. Por favor, tente novamente.")
    } finally {
      setIsExporting(false)
    }
  }

  const calculateRowSpan = (startTime: string, endTime: string) => {
    const startIndex = getStartSlotIndex(startTime)
    const endIndex = getEndSlotIndex(endTime)

    return endIndex - startIndex + 1
  }

  const getClassesForSlot = (day: string, timeSlot: string) => {
    const slotStartTime = timeSlot.split(" - ")[0]
    return scheduledClasses.filter((cls) => cls.day === day && cls.startTime === slotStartTime)
  }

  const isPartOfMultiRowClass = (day: string, timeSlotIndex: number) =>
    scheduledClasses.some((cls) => {
      if (cls.day !== day) return false

      const startIndex = getStartSlotIndex(cls.startTime)
      const endIndex = getEndSlotIndex(cls.endTime)

      return timeSlotIndex > startIndex && timeSlotIndex <= endIndex
    })

  const availableStartSlots = useMemo<string[]>(() => {
    if (!tempDay) return TIME_SLOTS
    return TIME_SLOTS.filter((slot) => {
      const [s, e] = slot.split(" - ")
      return !scheduledClasses.some(
        (c) => c.day === tempDay && c.id !== currentSchedule?.id && s < c.endTime && c.startTime < e,
      )
    })
  }, [tempDay, scheduledClasses, currentSchedule])

  const availableEndSlots = useMemo<string[]>(() => {
    if (!tempDay || !tempStartTime) return []
    return TIME_SLOTS.filter((slot) => {
      const [s, e] = slot.split(" - ")
      if (e <= tempStartTime) return false
      return !scheduledClasses.some(
        (c) => c.day === tempDay && c.id !== currentSchedule?.id && s < c.endTime && c.startTime < e,
      )
    })
  }, [tempDay, tempStartTime, scheduledClasses, currentSchedule])

  return (
    <div className="space-y-6">
      {isExporting && (
        <div className="absolute inset-0 z-50 bg-white bg-opacity-70 flex items-center justify-center">
          <span className="font-medium text-lg">Exportando...</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Horário Semanal</h2>
          <p className="text-muted-foreground">Organize suas disciplinas selecionadas em um horário semanal</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsExportDialogOpen(true)} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Horário
          </Button>
          <Button variant="default" size="sm" onClick={handleAddClass} disabled={isExporting}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Aula
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{scheduleName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div id="schedule-container" className="min-w-[800px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 bg-muted font-medium text-center w-32">Horário</th>
                    {DAYS_OF_WEEK.map((day) => (
                      <th key={day} className="border p-2 bg-muted font-medium text-center">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((timeSlot, timeIndex) => (
                    <tr key={timeSlot}>
                      <td className="border p-2 text-sm text-center">{timeSlot}</td>
                      {DAYS_OF_WEEK.map((day) => {
                        if (isPartOfMultiRowClass(day, timeIndex)) {
                          return null
                        }

                        const classesInSlot = getClassesForSlot(day, timeSlot)
                        if (classesInSlot.length === 0) {
                          return <td key={`${day}-${timeSlot}`} className="border p-1 h-12" />
                        }

                        return classesInSlot.map((cls) => {
                          const rowSpan = calculateRowSpan(cls.startTime, cls.endTime)
                          return (
                            <td
                              key={`${day}-${timeSlot}-${cls.id}`}
                              className={`border p-1 relative ${cls.color}`}
                              rowSpan={rowSpan > 0 ? rowSpan : 1}
                            >
                              <div
                                className="h-full flex flex-col justify-between p-1 cursor-pointer"
                                onClick={() => handleEditClass(cls)}
                              >
                                <div>
                                  <div className="font-medium text-sm">{cls.disciplinaNome}</div>
                                  <div className="text-xs">{cls.disciplinaCodigo}</div>
                                </div>
                                <div className="text-xs mt-1">
                                  {cls.startTime} - {cls.endTime}
                                </div>
                              </div>
                            </td>
                          )
                        })
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog for adding/editing a class */}
      <Dialog open={isAddClassDialogOpen} onOpenChange={setIsAddClassDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentSchedule ? "Editar Aula" : "Adicionar Aula"}{" "}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveClass(currentSchedule?.id || "")}
                className="h-8 w-8 p-0 text-destructive"
              >
                <span className="sr-only">Remover</span>
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveClass}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="disciplina" className="text-right">
                  Disciplina
                </Label>
                <div className="col-span-3">
                  <Select name="disciplina" value={tempDisciplinaId} onValueChange={setTempDisciplinaId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedDisciplinas.map((id) => {
                        const d = allDisciplinas.find((d) => d.codigo === id)
                        return d ? (
                          <SelectItem key={d.codigo} value={d.codigo}>
                            {d.nome}
                          </SelectItem>
                        ) : null
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="day" className="text-right">
                  Dia
                </Label>
                <div className="col-span-3">
                  <Select name="day" value={tempDay} onValueChange={setTempDay} disabled={!tempDisciplinaId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startTime" className="text-right">
                  Horário Início
                </Label>
                <div className="col-span-3">
                  <Select
                    name="startTime"
                    value={tempStartTime}
                    onValueChange={setTempStartTime}
                    disabled={!tempDay}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione horário de início" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStartSlots.map((slot) => {
                        const [s] = slot.split(" - ")
                        return (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endTime" className="text-right">
                  Horário Fim
                </Label>
                <div className="col-span-3">
                  <Select
                    name="endTime"
                    value={tempEndTime}
                    onValueChange={setTempEndTime}
                    disabled={!tempStartTime}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={tempStartTime ? "Selecione término" : "Escolha início primeiro"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEndSlots.map((slot) => {
                        const [, e] = slot.split(" - ")
                        return (
                          <SelectItem key={e} value={e}>
                            {e}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-y-2">
              <Button type="button" variant="outline" onClick={() => setIsAddClassDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for exporting the schedule */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Exportar Horário</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="scheduleName" className="text-right">
                Nome
              </Label>
              <Input
                id="scheduleName"
                value={scheduleName}
                onChange={(e) => setScheduleName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="exportFormat" className="text-right">
                Formato
              </Label>
              <div className="col-span-3">
                <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as "pdf" | "png" | "csv")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="png">Imagem (PNG)</SelectItem>
                    <SelectItem value="csv">CSV (Excel)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleExport} disabled={isExporting}>
              Exportar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
