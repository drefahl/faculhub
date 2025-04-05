"use server"

import type { Session } from "@/types"
import { decodeJwt, jwtVerify } from "jose"
import { cookies } from "next/headers"

const tokenName = "authToken"

export async function getSession(): Promise<Session | null> {
  const session = await decodeToken(await getCookieToken())
  return session
}

export async function getCookieToken() {
  const cookieStore = await cookies()
  return cookieStore.get(tokenName)?.value || ""
}

async function deleteCookieToken() {
  const cookieStore = await cookies()

  cookieStore.delete(tokenName)
}

const secret = new TextEncoder().encode("secret") //TODO: move to env

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)

    return payload
  } catch (error) {
    await deleteCookieToken()
    return null
  }
}

export async function decodeToken(token: string) {
  if (!token) return null
  return decodeJwt(token) as Session
}

export async function isTokenValid(token: string) {
  return !!(await verifyToken(token))
}

export async function signOut() {
  await deleteCookieToken()
}
