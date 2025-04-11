export const constants = {
  admin: {
    email: "admin@example.com",
    name: "Admin User",
    password: "Adm1nP@ssw0rd",
    role: "ADMIN",
  },
  user: {
    email: `user+${Date.now()}@example.com`,
    name: `User ${Date.now()}`,
    password: `P@ssW0rd-${Date.now()}`,
  },
  thread: {
    title: "Sample Thread",
    content: "This is a sample thread content.",
  },
  comment: {
    content: "Sample Comment",
  },
} as const
