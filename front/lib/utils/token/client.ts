"use client"

import Cookies from "js-cookie"
import { tokenName } from "./index"

export async function _getTokenCookie() {
  return Cookies.get(tokenName)
}

export async function _setTokenCookie(token: string) {
  Cookies.set(tokenName, token, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })
}

export async function _deleteTokenCookie() {
  Cookies.remove(tokenName)
}
