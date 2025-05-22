"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Redo,
  Table,
  Undo,
} from "lucide-react"
import type React from "react"
import { useState } from "react"

interface MarkdownEditorToolbarProps {
  insertText: (before: string, after?: string) => void
  cursorPosition: { start: number; end: number }
  markdown: string
  layoutControls?: React.ReactNode
}

export function MarkdownEditorToolbar({
  insertText,
  cursorPosition,
  markdown,
  layoutControls,
}: MarkdownEditorToolbarProps) {
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)

  const handleLinkInsert = () => {
    const linkMarkdown = `[${linkText || "texto do link"}](${linkUrl})`
    insertText(linkMarkdown)
    setLinkUrl("")
    setLinkText("")
    setIsLinkDialogOpen(false)
  }

  const handleImageInsert = () => {
    const imageMarkdown = `![${imageAlt || "imagem"}](${imageUrl})`
    insertText(imageMarkdown)
    setImageUrl("")
    setImageAlt("")
    setIsImageDialogOpen(false)
  }

  const handleUndo = () => {
    document.execCommand("undo")
  }

  const handleRedo = () => {
    document.execCommand("redo")
  }

  const handleLinkDialogOpen = () => {
    if (cursorPosition.start !== cursorPosition.end) {
      setLinkText(markdown.substring(cursorPosition.start, cursorPosition.end))
    }
    setIsLinkDialogOpen(true)
  }

  const handleImageDialogOpen = () => {
    if (cursorPosition.start !== cursorPosition.end) {
      setImageAlt(markdown.substring(cursorPosition.start, cursorPosition.end))
    }
    setIsImageDialogOpen(true)
  }

  const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0
  const ctrlKey = isMac ? "⌘" : "Ctrl"

  return (
    <div className="flex items-center justify-between gap-1 p-2 border-b overflow-x-auto overflow-hidden whitespace-nowrap">
      <div className="flex flex-wrap items-center gap-1">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => insertText("**", "**")}
                className="h-8 w-8"
              >
                <Bold className="h-4 w-4" />
                <span className="sr-only">Negrito</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{`Negrito (${ctrlKey}+B)`}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => insertText("*", "*")}
                className="h-8 w-8"
              >
                <Italic className="h-4 w-4" />
                <span className="sr-only">Itálico</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{`Itálico (${ctrlKey}+I)`}</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" onClick={() => insertText("# ")} className="h-8 w-8">
                <Heading1 className="h-4 w-4" />
                <span className="sr-only">Título 1</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{`Título 1 (${ctrlKey}+Alt+1)`}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" onClick={() => insertText("## ")} className="h-8 w-8">
                <Heading2 className="h-4 w-4" />
                <span className="sr-only">Título 2</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{`Título 2 (${ctrlKey}+Alt+2)`}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" onClick={() => insertText("### ")} className="h-8 w-8">
                <Heading3 className="h-4 w-4" />
                <span className="sr-only">Título 3</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{`Título 3 (${ctrlKey}+Alt+3)`}</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" onClick={() => insertText("- ")} className="h-8 w-8">
                <List className="h-4 w-4" />
                <span className="sr-only">Lista com Marcadores</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{`Lista com Marcadores (${ctrlKey}+Shift+L)`}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" onClick={() => insertText("1. ")} className="h-8 w-8">
                <ListOrdered className="h-4 w-4" />
                <span className="sr-only">Lista Numerada</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{`Lista Numerada (${ctrlKey}+Shift+O)`}</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost" size="icon" onClick={handleLinkDialogOpen} className="h-8 w-8">
                <Link className="h-4 w-4" />
                <span className="sr-only">Link</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Inserir Link</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="link-text" className="text-right">
                    Texto
                  </Label>
                  <Input
                    id="link-text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    className="col-span-3"
                    placeholder="Texto do link"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="link-url" className="text-right">
                    URL
                  </Label>
                  <Input
                    id="link-url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="col-span-3"
                    placeholder="https://exemplo.com"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleLinkInsert} disabled={!linkUrl}>
                  Inserir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost" size="icon" onClick={handleImageDialogOpen} className="h-8 w-8">
                <ImageIcon className="h-4 w-4" />
                <span className="sr-only">Imagem</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Inserir Imagem</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image-alt" className="text-right">
                    Texto Alternativo
                  </Label>
                  <Input
                    id="image-alt"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    className="col-span-3"
                    placeholder="Descrição da imagem"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image-url" className="text-right">
                    URL
                  </Label>
                  <Input
                    id="image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="col-span-3"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleImageInsert} disabled={!imageUrl}>
                  Inserir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => insertText("`", "`")}
                className="h-8 w-8"
              >
                <Code className="h-4 w-4" />
                <span className="sr-only">Código Inline</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{`Código Inline (${ctrlKey}+\`)`}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => insertText("```\n", "\n```")}
                className="h-8 w-8"
              >
                <Code className="h-4 w-4" />
                <span className="sr-only">Bloco de Código</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Bloco de Código</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" onClick={() => insertText("> ")} className="h-8 w-8">
                <Quote className="h-4 w-4" />
                <span className="sr-only">Citação</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Citação</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  insertText(
                    "| Cabeçalho | Cabeçalho |\n| --------- | --------- |\n| Célula    | Célula    |\n| Célula    | Célula    |",
                  )
                }
                className="h-8 w-8"
              >
                <Table className="h-4 w-4" />
                <span className="sr-only">Tabela</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Tabela</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" onClick={handleUndo} className="h-8 w-8">
                <Undo className="h-4 w-4" />
                <span className="sr-only">Desfazer</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{`Desfazer (${ctrlKey}+Z)`}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" onClick={handleRedo} className="h-8 w-8">
                <Redo className="h-4 w-4" />
                <span className="sr-only">Refazer</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{`Refazer (${ctrlKey}+Y)`}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {layoutControls}
    </div>
  )
}
