"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { createShortcut, useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Columns, Edit3, Maximize2, Minimize2, PanelBottom, PanelTop } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { MarkdownEditorToolbar } from "./markdown-editor-toolbar"
import { MarkdownPreview } from "./markdown-preview"
import { MarkdownStatusBar } from "./markdown-status-bar"

export type MarkdownEditorLayout = "split-horizontal" | "split-vertical" | "editor-only" | "compact"

export interface MarkdownEditorProps {
  initialValue?: string
  placeholder?: string
  onChange?: (value: string) => void
  className?: string
  minHeight?: number
  maxHeight?: number
  defaultLayout?: MarkdownEditorLayout
}

export function MarkdownEditor({
  initialValue = "",
  placeholder = "Write your markdown here...",
  onChange,
  className,
  minHeight = 300,
  maxHeight = 800,
  defaultLayout = "split-horizontal",
}: MarkdownEditorProps) {
  const [markdown, setMarkdown] = useState(initialValue)
  const [cursorPosition, setCursorPosition] = useState<{ start: number; end: number }>({ start: 0, end: 0 })
  const [layout, setLayout] = useState<MarkdownEditorLayout>(defaultLayout)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMarkdown(value)
    onChange?.(value)
  }

  const handleSelect = () => {
    if (textareaRef.current) {
      setCursorPosition({
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      })
    }
  }

  const insertText = useCallback(
    (before: string, after = "") => {
      if (textareaRef.current) {
        const textarea = textareaRef.current
        const { start, end } = cursorPosition
        const selectedText = markdown.substring(start, end)

        const newText = markdown.substring(0, start) + before + selectedText + after + markdown.substring(end)

        setMarkdown(newText)
        onChange?.(newText)

        // Set focus back to textarea and update cursor position
        setTimeout(() => {
          textarea.focus()
          const newCursorPos = start + before.length + selectedText.length + after.length
          textarea.setSelectionRange(
            selectedText ? start : newCursorPos,
            selectedText ? end + before.length + after.length : newCursorPos,
          )

          // Update cursor position state
          setCursorPosition({
            start: selectedText ? start : newCursorPos,
            end: selectedText ? end + before.length + after.length : newCursorPos,
          })
        }, 0)
      }
    },
    [markdown, cursorPosition, onChange],
  )

  const handleChangeLayout = (newLayout: MarkdownEditorLayout) => {
    setLayout(newLayout)
  }

  // Define keyboard shortcuts
  const shortcuts = [
    ...createShortcut("b", () => insertText("**", "**"), { useCtrlKey: true }),
    ...createShortcut("i", () => insertText("*", "*"), { useCtrlKey: true }),
    ...createShortcut("k", () => insertText("[", "](url)"), { useCtrlKey: true }),
    ...createShortcut("1", () => insertText("# "), { useCtrlKey: true, useAltKey: true }),
    ...createShortcut("2", () => insertText("## "), { useCtrlKey: true, useAltKey: true }),
    ...createShortcut("3", () => insertText("### "), { useCtrlKey: true, useAltKey: true }),
    ...createShortcut("4", () => insertText("#### "), { useCtrlKey: true, useAltKey: true }),
    ...createShortcut("5", () => insertText("##### "), { useCtrlKey: true, useAltKey: true }),
    ...createShortcut("6", () => insertText("###### "), { useCtrlKey: true, useAltKey: true }),
    ...createShortcut("l", () => insertText("- "), { useCtrlKey: true, useShiftKey: true }),
    ...createShortcut("o", () => insertText("1. "), { useCtrlKey: true, useShiftKey: true }),
    ...createShortcut("`", () => insertText("`", "`"), { useCtrlKey: true }),
    ...createShortcut("e", () => handleChangeLayout("editor-only"), { useCtrlKey: true, useAltKey: true }),
    ...createShortcut("s", () => handleChangeLayout("split-horizontal"), { useCtrlKey: true, useAltKey: true }),
    ...createShortcut("v", () => handleChangeLayout("split-vertical"), { useCtrlKey: true, useAltKey: true }),
    ...createShortcut("f", () => toggleFullscreen(), { useCtrlKey: true, useAltKey: true }),
  ]

  // Apply keyboard shortcuts
  useKeyboardShortcuts(shortcuts, textareaRef as React.RefObject<HTMLTextAreaElement>, true)

  useEffect(() => {
    // Initialize cursor position when component mounts
    if (textareaRef.current) {
      setCursorPosition({
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      })
    }
  }, [])

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Render layout controls
  const renderLayoutControls = () => (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setLayout("editor-only")}
        className={cn("h-8 w-8", layout === "editor-only" && "bg-muted")}
        title="Editor Only (Ctrl+Alt+E)"
      >
        <Edit3 className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setLayout("split-horizontal")}
        className={cn("h-8 w-8", layout === "split-horizontal" && "bg-muted")}
        title="Horizontal Split (Ctrl+Alt+S)"
      >
        <Columns className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setLayout("split-vertical")}
        className={cn("h-8 w-8", layout === "split-vertical" && "bg-muted")}
        title="Vertical Split (Ctrl+Alt+V)"
      >
        {layout === "split-vertical" ? <PanelTop className="h-4 w-4" /> : <PanelBottom className="h-4 w-4" />}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFullscreen}
        className="h-8 w-8"
        title="Fullscreen (Ctrl+Alt+F)"
      >
        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </Button>
    </div>
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        "border rounded-lg shadow-sm overflow-hidden flex flex-col",
        isFullscreen && "fixed inset-0 z-50 bg-background",
        className,
      )}
    >
      <MarkdownEditorToolbar
        insertText={insertText}
        cursorPosition={cursorPosition}
        markdown={markdown}
        layoutControls={renderLayoutControls()}
      />

      {isMobile || layout === "compact" ? (
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid grid-cols-2 mx-4 my-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="p-4 pt-0">
            <Textarea
              ref={textareaRef}
              value={markdown}
              onChange={handleChange}
              onSelect={handleSelect}
              onClick={handleSelect}
              onKeyUp={handleSelect}
              placeholder={placeholder}
              className={cn("font-mono resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0")}
              style={{ minHeight, maxHeight }}
            />
          </TabsContent>
          <TabsContent value="preview" className="p-4 pt-0">
            <div className="prose prose-sm dark:prose-invert max-w-none" style={{ minHeight, maxHeight }}>
              <MarkdownPreview markdown={markdown} />
            </div>
          </TabsContent>
        </Tabs>
      ) : layout === "editor-only" ? (
        <div className="h-full p-4">
          <Textarea
            ref={textareaRef}
            value={markdown}
            onChange={handleChange}
            onSelect={handleSelect}
            onClick={handleSelect}
            onKeyUp={handleSelect}
            placeholder={placeholder}
            className={cn("font-mono h-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0")}
            style={{ minHeight: minHeight - 40, maxHeight: maxHeight - 40 }}
          />
        </div>
      ) : (
        <ResizablePanelGroup
          direction={layout === "split-vertical" ? "vertical" : "horizontal"}
          className={cn(`min-h-[${minHeight}px]`)}
        >
          <ResizablePanel defaultSize={50}>
            <div className="h-full p-4">
              <Textarea
                ref={textareaRef}
                value={markdown}
                onChange={handleChange}
                onSelect={handleSelect}
                onClick={handleSelect}
                onKeyUp={handleSelect}
                placeholder={placeholder}
                className="font-mono h-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                style={{
                  height: layout === "split-vertical" ? "100%" : undefined,
                  minHeight: minHeight - 80,
                  maxHeight: maxHeight - 80,
                }}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div
              className="h-full p-4 prose prose-sm dark:prose-invert max-w-none overflow-auto"
              style={{
                height: layout === "split-vertical" ? "100%" : undefined,
                minHeight: minHeight - 80,
                maxHeight: maxHeight - 80,
              }}
            >
              <MarkdownPreview markdown={markdown} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}

      <MarkdownStatusBar
        characterCount={markdown.length}
        wordCount={markdown.trim() ? markdown.trim().split(/\s+/).length : 0}
        showKeyboardShortcutsHelp={true}
      />
    </div>
  )
}
