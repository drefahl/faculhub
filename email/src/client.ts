import type { CreateEmailOptions } from "resend"

export interface EmailClient {
  sendMail(options: CreateEmailOptions): Promise<void>
}

export interface SendMailOptions {
  from: string
  to: string | string[]
  subject: string
  html: string
  react: React.ReactNode
}
