"use server"

import { revalidatePath as nextRevalidatePath, revalidateTag as nextRevalidateTag } from "next/cache"

export async function revalidatePath(path: string, type?: "layout" | "page") {
  nextRevalidatePath(path, type)
}

export async function revalidateTag(tag: string) {
  nextRevalidateTag(tag)
}
