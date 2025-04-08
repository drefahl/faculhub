export const mockConstants = {
  user: {
    id: 1,
    email: "johnDoe@example.com",
    name: "John Doe",
    password: "password",
    profilePicId: null,
    googleId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  file: {
    id: "1",
    filename: "test.jpg",
    mimeType: "image/jpeg",
    data: Buffer.from("test"),
    createdAt: new Date(),
  },
} as const
