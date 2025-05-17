import { refresh } from "@/lib/api/axios/auth"
import type { Session } from "@/types"
import { decodeJwt } from "jose"

export const tokenName = "authToken"

const isServer = typeof window === "undefined"

async function _dynamicImport() {
  return isServer ? import("./server") : import("./client")
}

export async function getTokenCookie() {
  const { _getTokenCookie } = await _dynamicImport()
  return _getTokenCookie()
}

export async function setTokenCookie(token: string) {
  const { _setTokenCookie } = await _dynamicImport()
  return _setTokenCookie(token)
}

export async function getSession(): Promise<Session | null> {
  const session = await decodeToken(await getTokenCookie())
  return session
}

export async function decodeToken(token: string | undefined) {
  if (!token) return null
  return decodeJwt(token) as Session
}

export async function signOut() {
  const { _deleteTokenCookie } = await _dynamicImport()
  await _deleteTokenCookie()
}

export async function refreshToken() {
  const [err, response] = await refresh()
  if (err) return null

  const { token } = response
  await setTokenCookie(token)

  return token
}
