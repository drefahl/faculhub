import type { EmailClient } from "@/email/src/client"
import type { CreateEmailOptions } from "resend"

export class EmailService {
  constructor(private readonly client: EmailClient) {}

  async sendMail(options: CreateEmailOptions): Promise<void> {
    await this.client.sendMail(options)
  }
}
