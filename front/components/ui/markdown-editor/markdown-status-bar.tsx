"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { FileText, Hash, Keyboard } from "lucide-react"
import { useState } from "react"

interface MarkdownStatusBarProps {
  characterCount: number
  wordCount: number
  showKeyboardShortcutsHelp?: boolean
}

export function MarkdownStatusBar({
  characterCount,
  wordCount,
  showKeyboardShortcutsHelp = false,
}: MarkdownStatusBarProps) {
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false)
  const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0
  const ctrlKey = isMac ? "⌘" : "Ctrl"

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 px-4 py-2 text-xs text-muted-foreground border-t">
      <div className="flex items-center gap-2">
        {showKeyboardShortcutsHelp && (
          <Dialog open={isKeyboardShortcutsOpen} onOpenChange={setIsKeyboardShortcutsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1">
                <Keyboard className="h-3 w-3" />
                <span>Atalhos de Teclado</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Atalhos de Teclado</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2 py-4">
                <div className="text-sm font-medium">{`${ctrlKey}+B`}</div>
                <div className="text-sm">Negrito</div>

                <div className="text-sm font-medium">{`${ctrlKey}+I`}</div>
                <div className="text-sm">Itálico</div>

                <div className="text-sm font-medium">{`${ctrlKey}+K`}</div>
                <div className="text-sm">Link</div>

                <div className="text-sm font-medium">{`${ctrlKey}+Alt+1-6`}</div>
                <div className="text-sm">Títulos 1-6</div>

                <div className="text-sm font-medium">{`${ctrlKey}+Shift+L`}</div>
                <div className="text-sm">Lista com Marcadores</div>

                <div className="text-sm font-medium">{`${ctrlKey}+Shift+O`}</div>
                <div className="text-sm">Lista Numerada</div>

                <div className="text-sm font-medium">{`${ctrlKey}+\``}</div>
                <div className="text-sm">Código Inline</div>

                <div className="text-sm font-medium">{`${ctrlKey}+Alt+E`}</div>
                <div className="text-sm">Apenas Editor</div>

                <div className="text-sm font-medium">{`${ctrlKey}+Alt+P`}</div>
                <div className="text-sm">Apenas Visualização</div>

                <div className="text-sm font-medium">{`${ctrlKey}+Alt+S`}</div>
                <div className="text-sm">Divisão Horizontal</div>

                <div className="text-sm font-medium">{`${ctrlKey}+Alt+V`}</div>
                <div className="text-sm">Divisão Vertical</div>

                <div className="text-sm font-medium">{`${ctrlKey}+Alt+F`}</div>
                <div className="text-sm">Alternar Tela Cheia</div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 w-full lg:w-auto">
        <div className="flex items-center gap-1">
          <Hash className="h-3 w-3" />
          <span>{characterCount} caracteres</span>
        </div>
        <Separator orientation="vertical" className="h-3" />
        <div className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          <span>{wordCount} palavras</span>
        </div>
      </div>
    </div>
  )
}
