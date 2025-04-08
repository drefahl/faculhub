export type Session = {
  id: number
  email: string
  name: string
  picture: string | null
  providers: ["google"] | ["credentials"] | ["google", "credentials"]
}

export type Option<T = string> = { value: T; label: T }
