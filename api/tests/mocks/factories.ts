import { createAuthServiceMock } from "./auth.mocks"
import { createFileRepositoryMock, createFileServiceMock } from "./file.mocks"
import { createUserRepositoryMock } from "./user.mocks"
import { createUserServiceMock } from "./user.mocks"

export function createMockServices() {
  const fileRepository = createFileRepositoryMock()
  const fileService = createFileServiceMock(fileRepository)
  const userRepository = createUserRepositoryMock()
  const userService = createUserServiceMock(userRepository, fileService)
  const authService = createAuthServiceMock(userService)

  return {
    fileRepository,
    fileService,
    userRepository,
    userService,
    authService,
  }
}
