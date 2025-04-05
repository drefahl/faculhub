import type { FastifyReply, FastifyRequest } from "fastify"

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    console.log("Verifying JWT")
    await request.jwtVerify()
  } catch (err) {
    return reply.status(401).send({ message: "Unauthorized" })
  }
}
