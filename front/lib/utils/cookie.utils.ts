"use server"

import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"
import { cookies } from "next/headers"

const DEFAULT_OPTIONS: Partial<ResponseCookie> = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
}

/**
 * Get a cookie value by name
 * @param name Cookie name
 * @returns Cookie value or undefined if not found
 */
export async function getCookie(name: string): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(name)?.value
}

/**
 * Get all cookies
 * @returns Object with all cookies
 */
export async function getAllCookies(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const cookiesList = cookieStore.getAll()

  return cookiesList.reduce(
    (acc, cookie) => {
      acc[cookie.name] = cookie.value
      return acc
    },
    {} as Record<string, string>,
  )
}

/**
 * Set a cookie with the given name and value
 * @param name Cookie name
 * @param value Cookie value
 * @param options Cookie options
 */
export async function setCookie(name: string, value: string, options?: Partial<ResponseCookie>): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(name, value, { ...DEFAULT_OPTIONS, ...options })
}

/**
 * Delete a cookie by name
 * @param name Cookie name
 * @param options Cookie options (path must match the path used when setting)
 */
export async function deleteCookie(name: string, options?: Partial<ResponseCookie>): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(name)
}

/**
 * Check if a cookie exists
 * @param name Cookie name
 * @returns Boolean indicating if cookie exists
 */
export async function hasCookie(name: string): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.has(name)
}

/**
 * Set a JSON object as a cookie value
 * @param name Cookie name
 * @param value Object to serialize and store
 * @param options Cookie options
 */
export async function setJsonCookie<T extends Record<string, any>>(
  name: string,
  value: T,
  options?: Partial<ResponseCookie>,
): Promise<void> {
  await setCookie(name, JSON.stringify(value), options)
}

/**
 * Get a cookie value as a parsed JSON object
 * @param name Cookie name
 * @returns Parsed JSON object or null if cookie not found or invalid JSON
 */
export async function getJsonCookie<T extends Record<string, any>>(name: string): Promise<T | null> {
  const value = await getCookie(name)
  if (!value) return null

  try {
    return JSON.parse(value) as T
  } catch (e) {
    return null
  }
}
