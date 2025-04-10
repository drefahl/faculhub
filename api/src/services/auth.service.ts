import { env } from "@/config/env.config"
import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { comparePassword } from "@/lib/utils/crypto.utils"
import { getFileBytesFromUrl } from "@/lib/utils/file.utils"
import { createToken } from "@/lib/utils/jwt.utils"
import { getProfilePictureUrl, getUserProviders } from "@/lib/utils/user.utls"
import type { Token } from "@fastify/oauth2"
import { OAuth2Client } from "google-auth-library"
import type { FileService } from "./file.service"
import type { UserService } from "./user.service"

export class AuthService {
  private readonly googleClient: OAuth2Client

  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {
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

    const jwtToken = await createToken({
      id: user.id,
      email: user.email,
      name: user.name,
      picture: getProfilePictureUrl(user.profilePicId),
      providers: getUserProviders(user),
    })

    return jwtToken
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

    let fileCreationResult = null
    if (picture) {
      try {
        const imageData = await getFileBytesFromUrl(picture)
        if (imageData?.data && imageData.data.length > 0) {
          fileCreationResult = await this.fileService.createFile(
            imageData?.filename || "google-profile.jpg",
            imageData.mimeType,
            imageData.data,
          )
        }
      } catch (error) {
        console.error("Error fetching image from URL:", error)
      }
    }

    let user = await this.userService.getUserByEmail(email)

    if (!user) {
      user = await this.userService.createUserWithGoogle({
        email,
        googleId: sub,
        name,
        profilePic: fileCreationResult
          ? {
              connect: { id: fileCreationResult.id },
            }
          : undefined,
      })
    } else {
      if (fileCreationResult) {
        user = await this.userService.updateUser(user.id, {
          name,
          profilePic: {
            connect: { id: fileCreationResult.id },
          },
        })
      } else {
        user = await this.userService.updateUser(user.id, { name })
      }
    }

    const jwtToken = await createToken({
      id: user.id,
      email: user.email,
      name: user.name,
      picture: getProfilePictureUrl(user.profilePicId),
      providers: getUserProviders(user),
    })

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

  async refresh(userId: number) {
    const user = await this.userService.getUserById(userId)
    if (!user) {
      throw new InvalidCredentialsError("Invalid credentials")
    }

    const jwtToken = await createToken({
      id: user.id,
      email: user.email,
      name: user.name,
      picture: getProfilePictureUrl(user.profilePicId),
      providers: getUserProviders(user),
    })

    return jwtToken
  }
}
