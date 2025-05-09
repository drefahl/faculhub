"use client"

import { EditorClient } from "./ui/editor/client"

export const ReadOnlyViewer = ({ content }: { content: string }) => {
  return (
    <EditorClient
      content={content}
      onChangeContent={() => {}}
      disabled
      disableBubble
      hideBubble
      hideToolbar
      useEditorOptions={{ editable: false }}
      resetCSS
      dense
    />
  )
}
