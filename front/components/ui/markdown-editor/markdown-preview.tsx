"use client"

import { useIsMounted } from "@/hooks/use-is-mouted"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"

interface MarkdownPreviewProps {
  markdown: string
}

export function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  const mounted = useIsMounted()

  if (!mounted) {
    return <div className="animate-pulse h-full w-full bg-muted rounded-md" />
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={{
        code({ className, children }) {
          const match = /language-(\w+)/.exec(className || "")
          return match ? (
            <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div">
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className}>{children}</code>
          )
        },
        // Add custom renderers for other elements if needed
        img({ node, ...props }) {
          return <img className="max-w-full h-auto rounded-md" alt={props.alt || ""} {...props} />
        },
        a({ node, ...props }) {
          return <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
        },
        table({ node, ...props }) {
          return (
            <div className="overflow-x-auto">
              <table className="border-collapse border border-border w-full" {...props} />
            </div>
          )
        },
        th({ node, ...props }) {
          return <th className="border border-border p-2 bg-muted" {...props} />
        },
        td({ node, ...props }) {
          return <td className="border border-border p-2" {...props} />
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  )
}
