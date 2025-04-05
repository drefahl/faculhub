"use server"

import { cookies } from "next/headers"
import { tokenName } from "./index"

export async function _getTokenCookie() {
  const cookieStore = await cookies()
  return cookieStore.get(tokenName)?.value
}

export async function _setTokenCookie(token: string) {
  const cookieStore = await cookies()

  cookieStore.set(tokenName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })
}

export async function _deleteTokenCookie() {
  const cookieStore = await cookies()

  cookieStore.delete(tokenName)
}
