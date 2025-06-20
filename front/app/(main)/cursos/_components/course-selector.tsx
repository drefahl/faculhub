"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { GradeCurricular } from "@/types/grade"
import { sendGAEvent } from "@next/third-parties/google"
import { Check, ChevronsUpDown, ExternalLink, FileText } from "lucide-react"
import { useEffect, useState } from "react"

interface CourseOption {
  id: string
  name: string
  data: GradeCurricular
}

interface CourseSelectorProps {
  courses: CourseOption[]
  selectedCourse: CourseOption
  onSelectCourse: (course: CourseOption) => void
}

export function CourseSelector({ courses, selectedCourse, onSelectCourse }: CourseSelectorProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      sendGAEvent("event", "course_selector_opened", {})
    }
  }, [open])

  const handleSearch = (value: string) => {
    sendGAEvent("event", "course_search_typed", { query: value })
  }

  const handleSelect = (course: CourseOption) => {
    sendGAEvent("event", "course_selected", {
      course_id: course.id,
      course_name: course.name,
    })
    onSelectCourse(course)
    setOpen(false)
  }

  const handleDocClick = () => {
    sendGAEvent("event", "reference_doc_opened", {
      course_id: selectedCourse.id,
      doc_url: selectedCourse.data.documentoReferencia,
    })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" aria-expanded={open} className="w-full justify-between">
            {selectedCourse ? selectedCourse.name : "Selecionar curso..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput onValueChange={handleSearch} placeholder="Buscar cursos..." />
            <CommandList>
              <CommandEmpty>Nenhum curso encontrado.</CommandEmpty>
              <CommandGroup>
                {courses.map((course) => (
                  <CommandItem key={course.id} value={course.id} onSelect={() => handleSelect(course)}>
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedCourse.id === course.id ? "opacity-100" : "opacity-0")}
                    />
                    {course.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          Versão: {selectedCourse.data.versao}
        </div>

        <div className="flex items-center justify-center sm:justify-end gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={selectedCourse.data.documentoReferencia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  onClick={handleDocClick}
                >
                  <FileText className="h-4 w-4" />
                  <span>Documento de Referência</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </TooltipTrigger>

              <TooltipContent>
                <p>Abrir documento em nova aba</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
