"use client"

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"
import { CalendarIcon } from "lucide-react"
import { type HTMLAttributes, useState } from "react"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

interface DatePickerProps extends HTMLAttributes<HTMLDivElement> {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  format?: string
}

export function DatePicker({
  className,
  date,
  setDate,
  disabled,
  placeholder = "Selecione uma data",
  format: dateFormat = "dd/MM/yyyy",
}: DatePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      setIsPopoverOpen(false)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("pl-3 text-left font-normal w-full", !date && "text-muted-foreground")}
            disabled={disabled}
          >
            {date ? (
              format(date, dateFormat, {
                locale: ptBR,
              })
            ) : (
              <span>{placeholder}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 z-50" align="start">
          <Calendar
            initialFocus
            mode="single"
            defaultMonth={date || new Date()}
            selected={date}
            onSelect={handleDateSelect}
            disabled={disabled}
            className="border-none shadow-none p-3"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
