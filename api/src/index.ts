import { createServer } from "./app"
import { env } from "./config/env.config"

function handleExit(signal: string) {
  console.log(`Received ${signal}`)
  process.exit()
}

process.on("SIGINT", handleExit)
process.on("SIGTERM", handleExit)

const start = async () => {
  try {
    const app = await createServer()

    await app.listen({ port: env.PORT, host: env.HOST })

    console.log(`Server running at ${app.server.address()}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
