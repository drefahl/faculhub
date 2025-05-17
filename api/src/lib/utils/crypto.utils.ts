import crypto from "node:crypto"
import { env } from "@/config/env.config"
import { compare, hash } from "bcryptjs"

export async function hashPassword(password: string, rounds: string | number = 10): Promise<string> {
  return hash(password, rounds)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash)
}

const HASH_SECRET = env.HASH_SECRET
if (!HASH_SECRET) {
  throw new Error("HASH_SECRET não está configurado na ENV")
}

export function createHash(input: string): string {
  return crypto.createHmac("sha256", HASH_SECRET).update(input).digest("hex")
}

export function verifyHash(input: string, hash: string): boolean {
  const computed = createHash(input)
  return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(hash, "hex"))
}
