import { env } from "@/config/env.config"
import type { EmailClient, EmailMessage } from "@/contracts/email-client"
import { Resend } from "resend"

export class ResendClient implements EmailClient {
  private readonly resend = new Resend(env.RESEND_API_KEY)

  async sendMail({ from, to, subject, html, react, text }: EmailMessage) {
    await this.resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      react,
    })
  }
}
