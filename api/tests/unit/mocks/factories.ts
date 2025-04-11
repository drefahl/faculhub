import { AuthService } from "@/services/auth.service"
import { CommentService } from "@/services/comment.service"
import { FileService } from "@/services/file.service"
import { ThreadService } from "@/services/thread.service"
import { UserService } from "@/services/user.service"
import { createCommentRepositoryMock } from "./comment.mocks"
import { createFileRepositoryMock } from "./file.mocks"
import { createThreadRepositoryMock } from "./thread.mocks"
import { createUserRepositoryMock } from "./user.mocks"

export function createMockServices() {
  const fileRepository = createFileRepositoryMock()
  const fileService = new FileService(fileRepository)
  const userRepository = createUserRepositoryMock()
  const userService = new UserService(userRepository, fileService)
  const authService = new AuthService(userService, fileService)
  const threadRepository = createThreadRepositoryMock()
  const threadService = new ThreadService(threadRepository, userRepository)
  const commentRepository = createCommentRepositoryMock()
  const commentService = new CommentService(commentRepository, threadRepository)

  return {
    fileRepository,
    fileService,
    userRepository,
    userService,
    authService,
    threadRepository,
    threadService,
    commentRepository,
    commentService,
  }
}
