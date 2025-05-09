import dynamic from "next/dynamic"
import type { EditorProps } from "./index"

const UiEditor = dynamic(() => import("./index").then((module) => module.Editor), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

export const EditorClient = (props: EditorProps) => {
  return <UiEditor {...props} />
}
