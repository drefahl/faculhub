export function getUserInitials(name?: string | null): string {
  if (!name) return "U"

  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

export function isGoogleAccount(providers?: string[]): boolean {
  return providers?.includes("google") || false
}

export function isUsingCredentials(providers?: string[]): boolean {
  return providers?.includes("credentials") || false
}

export function isOnlyUsingCredentials(providers?: string[]): boolean {
  return providers?.length === 1 && providers[0] === "credentials"
}

export function getProfilePicUrl(profilePicId: string | null | undefined): string | null {
  if (!profilePicId) return null

  return `${process.env.NEXT_PUBLIC_API_URL}/api/files/${profilePicId}`
}
