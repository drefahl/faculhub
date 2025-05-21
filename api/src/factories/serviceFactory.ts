import { ResendClient } from "@/clients/resend.client"
import { CategoryRepository } from "@/repositories/category.repository"
import { CommentRepository } from "@/repositories/comment.repository"
import { CourseRepository } from "@/repositories/course.repository"
import { FileRepository } from "@/repositories/file.repository"
import { LikeRepository } from "@/repositories/like.repository"
import { PasswordResetRepository } from "@/repositories/password-reset.repository"
import { PostRepository } from "@/repositories/post.repository"
import { ThreadRepository } from "@/repositories/thread.repository"
import { UserRepository } from "@/repositories/user.repository"
import { AuthService } from "@/services/auth.service"
import { CategoryService } from "@/services/category.service"
import { CommentService } from "@/services/comment.service"
import { CourseService } from "@/services/course.service"
import { EmailService } from "@/services/email.service"
import { FileService } from "@/services/file.service"
import { LikeService } from "@/services/like.service"
import { PasswordResetService } from "@/services/password-reset.service"
import { PostService } from "@/services/post.service"
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
  return new ThreadService(new ThreadRepository(), new UserRepository(), createCategoryService())
}

export function createCommentService() {
  return new CommentService(new CommentRepository(), new ThreadRepository())
}

export function createPostService() {
  return new PostService(new PostRepository())
}

export function createLikeService() {
  return new LikeService(new LikeRepository())
}

export function createCourseService() {
  return new CourseService(new CourseRepository())
}

export function createEmailService() {
  return new EmailService(new ResendClient())
}

export function createPasswordResetService() {
  return new PasswordResetService(new PasswordResetRepository(), createUserService(), createEmailService())
}

export function createCategoryService() {
  return new CategoryService(new CategoryRepository())
}
