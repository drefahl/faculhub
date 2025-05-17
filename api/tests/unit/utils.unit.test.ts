import { Readable } from "node:stream"
import { createCookieOptions } from "@/lib/utils/cookie.utils"
import { comparePassword, createHash, hashPassword, verifyHash } from "@/lib/utils/crypto.utils"
import { fileStreamToBuffer, getFileBytesFromUrl } from "@/lib/utils/file.utils"
import { createToken, decodeToken, tokenSchema, verifyToken } from "@/lib/utils/jwt.utils"
import { getUserProviders, isUserAdmin } from "@/lib/utils/user.utils"
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

describe("Cookie options util", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("defaults secure=false in development", async () => {
    const opts = createCookieOptions()
    expect(opts.secure).toBe(false)
    expect(opts.path).toBe("/")
    expect(opts.maxAge).toBe(60 * 60 * 24 * 7)
    expect(opts.sameSite).toBe("lax")
  })

  it("overrides options correctly", async () => {
    const overrides = { secure: true, path: "/api" }
    const opts = createCookieOptions(overrides)
    expect(opts.secure).toBe(true)
    expect(opts.path).toBe("/api")
  })
})

beforeAll(() => {
  global.fetch = vi.fn(async (url: any) => {
    if (String(url).includes("bad-url")) {
      return { ok: false, status: 404, headers: { get: () => null } } as any
    }
    const buffer = Buffer.from("hello world")
    return {
      ok: true,
      arrayBuffer: async () => buffer.buffer,
      headers: { get: () => "application/octet-stream" },
    } as any
  })
})

describe("Password utils", () => {
  it("hashes and compares correctly", async () => {
    const raw = "MyP@ssw0rd"
    const hashed = await hashPassword(raw, 4)
    expect(typeof hashed).toBe("string")
    expect(await comparePassword(raw, hashed)).toBe(true)
    expect(await comparePassword("wrong", hashed)).toBe(false)
  })
})

describe("Hash Utils", () => {
  const SECRET = "my-test-secret"

  beforeAll(() => {
    process.env.HASH_SECRET = SECRET
  })

  it("createHash returns a 64-character hex string", () => {
    const h = createHash("foo")
    expect(typeof h).toBe("string")
    expect(h).toMatch(/^[a-f0-9]{64}$/)
  })

  it("same input always generates the same hash", () => {
    const a = createHash("bar")
    const b = createHash("bar")
    expect(a).toBe(b)
  })

  it("different inputs generate different hashes", () => {
    const a = createHash("baz")
    const b = createHash("qux")
    expect(a).not.toBe(b)
  })

  it("verifyHash returns true when the input matches the hash", () => {
    const input = "secret-password"
    const h = createHash(input)
    expect(verifyHash(input, h)).toBe(true)
  })

  it("verifyHash returns false for incorrect input", () => {
    const h = createHash("original")
    expect(verifyHash("something-else", h)).toBe(false)
  })

  it("handles empty input correctly", () => {
    const h = createHash("")
    expect(h).toHaveLength(64)
    expect(verifyHash("", h)).toBe(true)
    expect(verifyHash(" ", h)).toBe(false)
  })
})

describe("File utils", () => {
  it("fetches file bytes successfully", async () => {
    const { data, mimeType, filename } = await getFileBytesFromUrl("http://example.com/file.bin")
    expect(data).toBeInstanceOf(Buffer)
    expect(mimeType).toBe("application/octet-stream")
    expect(filename).toBe("file.bin")
  })

  it("throws on bad fetch", async () => {
    await expect(getFileBytesFromUrl("http://bad-url/test")).rejects.toThrow("Failed to fetch file")
  })

  it("converts stream to buffer correctly", async () => {
    const chunks = [Buffer.from("a"), Buffer.from("b"), Buffer.from("c")]
    const stream = new Readable({
      read() {
        this.push(chunks.shift() || null)
      },
    })
    const buf = await fileStreamToBuffer(stream)
    expect(buf.toString()).toBe("abc")
  })
})

describe("JWT utils", () => {
  it("creates and verifies token payload", async () => {
    const email = "a@b.com"

    const token = await createToken({
      id: 1,
      email: "a@b.com",
      name: null,
      picture: null,
      role: "USER",
      providers: ["credentials"],
    })

    expect(typeof token).toBe("string")
    const verified = await verifyToken(token)
    tokenSchema.parse(verified)
    const decoded = decodeToken(token)
    expect(decoded.email).toBe(email)
  })
})

describe("User utils", () => {
  it("returns correct providers array", () => {
    const user1 = { id: 1, password: "h", googleId: null } as any
    expect(getUserProviders(user1)).toEqual(["credentials"])
    const user2 = { id: 1, password: null, googleId: "gId" } as any
    expect(getUserProviders(user2)).toEqual(["google"])
    const user3 = { id: 1, password: "h", googleId: "gId" } as any
    expect(getUserProviders(user3)).toEqual(["credentials", "google"])
  })

  it("checks admin role correctly", () => {
    expect(isUserAdmin({ role: "ADMIN" } as any)).toBe(true)
    expect(isUserAdmin({ role: "USER" } as any)).toBe(false)
  })
})
