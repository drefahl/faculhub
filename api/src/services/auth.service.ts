import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { createToken } from "@/lib/utils/jwt.utils"
import { comparePassword } from "../lib/utils/crypto.utils"
import { UserService } from "./user.service"
import { OAuth2Client } from "google-auth-library"
import { env } from "@/config/env.config"
import type { Token } from "@fastify/oauth2"

export class AuthService {
  private readonly googleClient: OAuth2Client

  constructor(private readonly userService: UserService = new UserService()) {
    this.googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID)
  }

  async login(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email)
    if (!user || !user.password) {
      throw new InvalidCredentialsError("Invalid credentials")
    }

    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      throw new InvalidCredentialsError("Invalid credentials")
    }

    const token = await createToken({ id: user.id, email: user.email })

    return token
  }

  async googleLogin(token: Token) {
    if (!token.id_token) {
      throw new InvalidCredentialsError("Invalid credentials")
    }

    const payload = await this.verifyGoogleToken(token.id_token)
    if (!payload) {
      throw new InvalidCredentialsError("Invalid credentials")
    }

    const { email, name, picture, sub } = payload

    if (!email) {
      throw new InvalidCredentialsError("Invalid credentials")
    }

    let user = await this.userService.getUserByEmail(email)

    if (!user) {
      user = await this.userService.createUserWithGoogle({ email, googleId: sub, name, picture })
    } else {
      user = await this.userService.updateUser(user.id, { name, picture })
    }

    const jwtToken = await createToken({ id: user.id, email: user.email })

    return jwtToken
  }

  private async verifyGoogleToken(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID })

      return ticket.getPayload()
    } catch (error) {
      return null
    }
  }
}
