"use server"

import { deleteCookie, getCookie, setCookie } from "../cookie.utils"
import { tokenName } from "./index"

export async function _getTokenCookie() {
  return await getCookie(tokenName)
}

export async function _setTokenCookie(token: string) {
  await setCookie(tokenName, token)
}

export async function _deleteTokenCookie() {
  await deleteCookie(tokenName)
}
