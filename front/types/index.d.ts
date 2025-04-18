export type Session = {
  id: number
  email: string
  name: string
  picture: string | null
  role: "USER" | "ADMIN"
  providers: ["google"] | ["credentials"] | ["google", "credentials"]
}

export type Option<T = string> = { value: T; label: T }
