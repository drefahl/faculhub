import { env } from "@/config/env.config"
import type { EmailClient, EmailMessage } from "@/contracts/email-client"

export class EmailService {
  constructor(private readonly client: EmailClient) {}

  async sendMail(options: EmailMessage): Promise<void> {
    if (env.NODE_ENV !== "production") return

    await this.client.sendMail(options)
  }
}
