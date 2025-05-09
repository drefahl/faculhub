"use client"

import { type ComponentProps, useCallback } from "react"
import RichTextEditor, { BaseKit } from "reactjs-tiptap-editor"
import { Blockquote } from "reactjs-tiptap-editor/blockquote"
import { Bold } from "reactjs-tiptap-editor/bold"
import { BulletList } from "reactjs-tiptap-editor/bulletlist"
import { Clear } from "reactjs-tiptap-editor/clear"
import { Code } from "reactjs-tiptap-editor/code"
import { CodeBlock } from "reactjs-tiptap-editor/codeblock"
import { Color } from "reactjs-tiptap-editor/color"
import { Emoji } from "reactjs-tiptap-editor/emoji"
import { ExportPdf } from "reactjs-tiptap-editor/exportpdf"
import { ExportWord } from "reactjs-tiptap-editor/exportword"
import { FontFamily } from "reactjs-tiptap-editor/fontfamily"
import { FontSize } from "reactjs-tiptap-editor/fontsize"
import { FormatPainter } from "reactjs-tiptap-editor/formatpainter"
import { Heading } from "reactjs-tiptap-editor/heading"
import { Highlight } from "reactjs-tiptap-editor/highlight"
import { History } from "reactjs-tiptap-editor/history"
import { HorizontalRule } from "reactjs-tiptap-editor/horizontalrule"
import { Iframe } from "reactjs-tiptap-editor/iframe"
import { ImportWord } from "reactjs-tiptap-editor/importword"
import { Indent } from "reactjs-tiptap-editor/indent"
import { Italic } from "reactjs-tiptap-editor/italic"
import { LineHeight } from "reactjs-tiptap-editor/lineheight"
import { Link } from "reactjs-tiptap-editor/link"
import { locale } from "reactjs-tiptap-editor/locale-bundle"
import { Mention } from "reactjs-tiptap-editor/mention"
import { MoreMark } from "reactjs-tiptap-editor/moremark"
import { ColumnActionButton } from "reactjs-tiptap-editor/multicolumn"
import { OrderedList } from "reactjs-tiptap-editor/orderedlist"
import { SearchAndReplace } from "reactjs-tiptap-editor/searchandreplace"
import { SlashCommand } from "reactjs-tiptap-editor/slashcommand"
import { Strike } from "reactjs-tiptap-editor/strike"
import { Table } from "reactjs-tiptap-editor/table"
import { TableOfContents } from "reactjs-tiptap-editor/tableofcontent"
import { TaskList } from "reactjs-tiptap-editor/tasklist"
import { TextAlign } from "reactjs-tiptap-editor/textalign"
import { TextDirection } from "reactjs-tiptap-editor/textdirection"
import { TextUnderline } from "reactjs-tiptap-editor/textunderline"

locale.setLang("pt_BR")

function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout
  return function (...args: any[]) {
    clearTimeout(timeout)
    // @ts-ignore
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

export type EditorProps = {
  content: string
  onChangeContent: (value: any) => void
} & Omit<ComponentProps<typeof RichTextEditor>, "extensions" | "output">

export function Editor({ content, onChangeContent, ...props }: EditorProps) {
  const onValueChange = useCallback(
    debounce((value: any) => {
      onChangeContent(value)
    }, 300),
    [],
  )

  return (
    <RichTextEditor
      {...props}
      output="html"
      content={content}
      onChangeContent={onValueChange}
      extensions={extensions}
      bubbleMenu={{
        render(_, bubbleDefaultDom) {
          return <>{bubbleDefaultDom}</>
        },
      }}
    />
  )
}

const extensions = [
  BaseKit.configure({
    characterCount: false,
  }),
  History,
  SearchAndReplace,
  TableOfContents,
  FormatPainter.configure({ spacer: true }),
  Clear,
  FontFamily,
  Heading.configure({ spacer: true }),
  FontSize,
  Bold,
  Italic,
  TextUnderline,
  Strike,
  MoreMark,
  Emoji,
  Color.configure({ spacer: true }),
  Highlight,
  BulletList,
  OrderedList,
  TextAlign.configure({ types: ["heading", "paragraph"], spacer: true }),
  Indent,
  LineHeight,
  TaskList.configure({
    spacer: true,
    taskItem: {
      nested: true,
    },
  }),
  Link,
  Blockquote,
  SlashCommand,
  HorizontalRule,
  Code.configure({
    toolbar: false,
  }),
  CodeBlock,
  ColumnActionButton,
  Table,
  Iframe,
  ExportPdf.configure({ spacer: true }),
  ImportWord.configure({
    upload: (files: File[]) => {
      const f = files.map((file) => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }))
      return Promise.resolve(f)
    },
  }),
  ExportWord,
  TextDirection,
  Mention,
]
