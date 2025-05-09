import type { FastifyReply, FastifyRequest } from "fastify"

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    return reply.status(401).send({ message: "Unauthorized" })
  }
}

export async function attachUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {}
}

export async function adminCheck(request: FastifyRequest, reply: FastifyReply) {
  if (request.user?.role !== "ADMIN") {
    return reply.status(403).send({ message: "Forbidden" })
  }
}
