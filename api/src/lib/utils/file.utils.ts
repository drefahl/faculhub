import { z } from "zod"

const urlSchema = z.string().url()

type FetchedFileData = {
  data: Buffer
  mimeType: string
  filename: string
}

export async function getFileBytesFromUrl(url: string): Promise<FetchedFileData> {
  const validUrl = urlSchema.parse(url)

  const response = await fetch(validUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch file from URL: ${validUrl}`)
  }

  const arrayBuffer = await response.arrayBuffer()

  return {
    data: Buffer.from(arrayBuffer),
    mimeType: response.headers.get("content-type") || "application/octet-stream",
    filename: validUrl.split("/").pop() || "file",
  }
}

export async function fileStreamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []

    stream.on("data", (chunk) => {
      chunks.push(Buffer.from(chunk))
    })

    stream.on("end", () => {
      resolve(Buffer.concat(chunks))
    })

    stream.on("error", (error) => {
      reject(error)
    })
  })
}
