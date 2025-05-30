import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import * as path from "node:path"
import { createServer } from "@/app"
import type { FastifyInstance } from "fastify"
import request from "supertest"
import { getAuthToken } from "tests/helpers/get-auth-token"
import { resetDatabase } from "tests/helpers/reset-db"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"

let app: FastifyInstance
let tmpResourcesDir: string
let token: string

describe("User Uploads Integration Tests", () => {
  const upload = (fileName: string) =>
    request(app.server)
      .put("/users/profile-image")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", path.join(tmpResourcesDir, fileName))

  beforeEach(async () => {
    const userData = {
      email: `user+${Date.now()}@example.com`,
      password: `P@ssW0rd-${Date.now()}`,
      name: `User ${Date.now()}`,
    } as const

    token = await getAuthToken(app, {
      email: userData.email,
      password: userData.password,
      name: userData.name,
    })
  })

  beforeAll(async () => {
    await resetDatabase()
    app = await createServer()

    tmpResourcesDir = await mkdtemp(path.join(tmpdir(), "upload-test-"))

    const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4////fwAJ/wP+PdP4pQAAAABJRU5ErkJggg=="

    await writeFile(path.join(tmpResourcesDir, "testImage.png"), Buffer.from(pngBase64, "base64"))
    await writeFile(path.join(tmpResourcesDir, "notAnImage.txt"), "this is not a PNG")
  })

  afterAll(async () => {
    await app.close()
    await rm(tmpResourcesDir, { recursive: true, force: true })
  })

  it("returns 401 if not authenticated", async () => {
    const res = await request(app.server)
      .put("/users/profile-image")
      .attach("file", path.join(tmpResourcesDir, "testImage.png"))

    expect(res.status).toBe(401)
  })

  it("uploads a valid image", async () => {
    const res = await upload("testImage.png")

    expect(res.status).toBeLessThan(400)
  })

  it("rejects invalid file type", async () => {
    const res = await upload("notAnImage.txt")

    expect(res.status).toBe(400)
    expect(res.body.message).toContain("Invalid image file")
  })
})
