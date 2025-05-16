import { type CreateEmailOptions, Resend } from "resend"
import type { EmailClient } from "./client"

export class ResendEmailClient implements EmailClient {
  private client: Resend

  constructor(apiKey: string) {
    this.client = new Resend(apiKey)
  }

  async sendMail(options: CreateEmailOptions): Promise<void> {
    await this.client.emails.send(options)
  }
}
