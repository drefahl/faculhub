"use client"

import DOMPurify from "dompurify"

export function DangerousInnerHtml({ content }: { content: string }) {
  return (
    <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
  )
}
