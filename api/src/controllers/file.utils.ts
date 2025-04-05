import fs from "node:fs"
import path from "node:path"

export async function saveFileToDisk(
  fileStream: NodeJS.ReadableStream,
  filename: string,
  uploadDir: string,
): Promise<string> {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const filePath = path.join(uploadDir, filename)

  const writeStream = fs.createWriteStream(filePath)
  fileStream.pipe(writeStream)

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(filePath))
    writeStream.on("error", (error) => reject(error))
  })
}

export async function deleteFileFromDisk(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err && err.code !== "ENOENT") return reject(err)
      resolve()
    })
  })
}
