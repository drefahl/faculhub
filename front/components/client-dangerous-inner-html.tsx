"use client"

import dynamic from "next/dynamic"
const DynamicComponent = dynamic(() => import("./dangerous-inner-html").then((module) => module.DangerousInnerHtml), {
  ssr: false,
  loading: () => <div className="prose prose-lg max-w-none mb-8">Loading...</div>,
})

export function DangerousInnerHtml({ content }: { content: string }) {
  return <DynamicComponent content={content} />
}
