import type { JSX } from "react"

export interface EmailMessage {
  from: string
  to: string
  subject: string
  html?: string
  text?: string
  react?: JSX.Element
}

export interface EmailClient {
  sendMail(message: EmailMessage): Promise<void>
}
