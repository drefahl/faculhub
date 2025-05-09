import type { comment, course, file, like, post, thread, user } from "@prisma/client"

type MockConstants = {
  user: Partial<user> & { hashedPassword: string }
  file: Partial<file>
  thread: Partial<thread>
  comment: Partial<comment>
  post: Partial<post>
  course: Partial<course>
  like: Partial<like>
}

export const mockConstants = {
  user: {
    id: 1,
    email: "johnDoe@example.com",
    name: "John Doe",
    password: "rAnd0mP@ssw0rd",
    hashedPassword: "$2a$10$7nM.m6vAIZ529WkNYNkfju6mVUg7eBl8pb3w3//z48EJBmfdQAy1.",
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
  thread: {
    id: 1,
    title: "Mocked Thread",
    content: "Mocked Content",
    authorId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  comment: {
    id: 1,
    threadId: 1,
    content: "This is a comment",
    authorId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  course: {
    id: 1,
    name: "Computer Science",
    code: "CS101",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  like: {
    id: 1,
    userId: 1,
    postId: 1,
  },
  post: {
    id: 1,
    title: "Mocked Post",
    content: "This is a mocked post content",
    authorId: 1,
    courseId: 1,
    type: "NEWS",
    isPinned: false,
    eventDate: null,
    location: null,
    coverImage: null,
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
} as const
