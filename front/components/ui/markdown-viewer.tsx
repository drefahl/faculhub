import { cn } from "@/lib/utils"
import { MarkdownPreview } from "./markdown-editor/markdown-preview"

interface MarkdownViewerProps {
  markdown: string
  className?: string
}

export function MarkdownViewer({ markdown, className }: MarkdownViewerProps) {
  return (
    <div className={cn("h-full p-4 prose prose-sm dark:prose-invert max-w-none overflow-auto", className)}>
      <MarkdownPreview markdown={markdown} />
    </div>
  )
}
