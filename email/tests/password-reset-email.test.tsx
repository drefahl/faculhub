import { render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import PasswordResetEmail from "../emails/password-reset-email"

describe("PasswordResetEmail", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2025-05-15T12:00:00Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders correctly with username and reset URL", async () => {
    render(
      <PasswordResetEmail
        username="Cauã"
        resetUrl="https://url"
        expiresAt={new Date(Date.now() + 24 * 60 * 60 * 1000)}
      />,
    )

    expect(screen.getByText("Pedido de Redefinição de Palavra-Passe")).toBeTruthy()

    expect(screen.getByText("Olá Cauã,")).toBeTruthy()

    expect(
      screen.getByText(
        "Recebemos um pedido para redefinir a sua palavra-passe da sua conta Faculhub. Para proceder com a redefinição da sua palavra-passe, por favor clique no botão abaixo:",
      ),
    ).toBeTruthy()

    expect(screen.getByText("Redefinir Palavra-Passe")).toBeTruthy()

    expect(
      screen.getByText(
        "Se não solicitou a redefinição da palavra-passe, pode ignorar este email. A sua palavra-passe permanecerá inalterada.",
      ),
    ).toBeTruthy()
  })

  it("renders correctly with expiry hours", async () => {
    render(
      <PasswordResetEmail
        username="Cauã"
        resetUrl="https://url"
        expiresAt={new Date(Date.now() + 24 * 60 * 60 * 1000)}
      />,
    )

    expect(screen.getByText("Este link para redefinir a palavra-passe irá expirar em 24 horas.")).toBeTruthy()
  })

  it("renders correctly with security message", async () => {
    render(
      <PasswordResetEmail
        username="Cauã"
        resetUrl="https://url"
        expiresAt={new Date(Date.now() + 24 * 60 * 60 * 1000)}
      />,
    )

    expect(
      screen.getByText(
        "Por razões de segurança, este link só pode ser utilizado uma vez. Se precisar de redefinir a sua palavra-passe novamente, por favor solicite um novo link.",
      ),
    ).toBeTruthy()
  })

  it("throws an error if required props are missing", () => {
    expect(() => render(<PasswordResetEmail resetUrl="" expiresAt={new Date()} />)).toThrow(
      "Missing required props: username, resetUrl, or expiresAt",
    )
  })

  it("throws an error if expiresAt is in the past", () => {
    expect(() =>
      render(
        <PasswordResetEmail
          username="Cauã"
          resetUrl="https://url"
          expiresAt={new Date(Date.now() - 24 * 60 * 60 * 1000)}
        />,
      ),
    ).toThrow("The expiration date must be in the future")
  })
})
