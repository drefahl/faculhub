import { AuthService } from "@/services/auth.service"
import { CommentService } from "@/services/comment.service"
import { CourseService } from "@/services/course.service"
import { FileService } from "@/services/file.service"
import { LikeService } from "@/services/like.service"
import { PostService } from "@/services/post.service"
import { ThreadService } from "@/services/thread.service"
import { UserService } from "@/services/user.service"
import { createCommentRepositoryMock } from "./comment.mocks"
import { createCourseRepositoryMock } from "./course.mocls"
import { createFileRepositoryMock } from "./file.mocks"
import { createLikeRepositoryMock } from "./like.mocks"
import { createPostRepositoryMock } from "./post.mocks"
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
  const likeRepository = createLikeRepositoryMock()
  const likeService = new LikeService(likeRepository)
  const postRepository = createPostRepositoryMock()
  const postService = new PostService(postRepository)
  const courseRepository = createCourseRepositoryMock()
  const courseService = new CourseService(courseRepository)

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
    likeRepository,
    likeService,
    postRepository,
    postService,
    courseRepository,
    courseService,
  }
}
