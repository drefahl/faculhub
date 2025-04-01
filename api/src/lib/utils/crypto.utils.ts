import { hash, compare } from "bcryptjs"

export async function hashPassword(password: string, rounds: string | number = 10): Promise<string> {
  return hash(password, rounds)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash)
}
