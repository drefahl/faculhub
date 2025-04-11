import { CommentRepository } from "@/repositories/comment.repository"
import { FileRepository } from "@/repositories/file.repository"
import { ThreadRepository } from "@/repositories/thread.repository"
import { UserRepository } from "@/repositories/user.repository"
import { AuthService } from "@/services/auth.service"
import { CommentService } from "@/services/comment.service"
import { FileService } from "@/services/file.service"
import { ThreadService } from "@/services/thread.service"
import { UserService } from "@/services/user.service"

export function createFileService() {
  return new FileService(new FileRepository())
}

export function createUserService() {
  return new UserService(new UserRepository(), createFileService())
}

export function createAuthService() {
  return new AuthService(createUserService(), createFileService())
}

export function createThreadService() {
  return new ThreadService(new ThreadRepository(), new UserRepository())
}

export function createCommentService() {
  return new CommentService(new CommentRepository(), new ThreadRepository())
}
