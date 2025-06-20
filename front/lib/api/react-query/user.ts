/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * API documentation
 * OpenAPI spec version: 1.0.0
 */
import { useMutation, useQuery } from "@tanstack/react-query"
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query"

import type {
  CreateUser201,
  CreateUserBody,
  DeleteProfileImage200,
  DeleteProfileImage404,
  GetUserProfile200,
  UpdateUserProfile200,
  UpdateUserProfileBody,
  UploadProfileImage200,
  UploadProfileImage400,
  UploadProfileImage500,
} from "./generated.schemas"

import { request } from "../../utils/axios"
import type { ErrorType } from "../../utils/axios"

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1]

/**
 * Create a new user
 */
export const createUser = (
  createUserBody: CreateUserBody,
  options?: SecondParameter<typeof request>,
  signal?: AbortSignal,
) => {
  return request<CreateUser201>(
    { url: `/users/`, method: "POST", headers: { "Content-Type": "application/json" }, data: createUserBody, signal },
    options,
  )
}

export const getCreateUserMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, { data: CreateUserBody }, TContext>
  request?: SecondParameter<typeof request>
}): UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, { data: CreateUserBody }, TContext> => {
  const mutationKey = ["createUser"]
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof createUser>>, { data: CreateUserBody }> = (props) => {
    const { data } = props ?? {}

    return createUser(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type CreateUserMutationResult = NonNullable<Awaited<ReturnType<typeof createUser>>>
export type CreateUserMutationBody = CreateUserBody
export type CreateUserMutationError = ErrorType<unknown>

export const useCreateUser = <TError = ErrorType<unknown>, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, { data: CreateUserBody }, TContext>
    request?: SecondParameter<typeof request>
  },
  queryClient?: QueryClient,
): UseMutationResult<Awaited<ReturnType<typeof createUser>>, TError, { data: CreateUserBody }, TContext> => {
  const mutationOptions = getCreateUserMutationOptions(options)

  return useMutation(mutationOptions, queryClient)
}
/**
 * Get user profile
 */
export const getUserProfile = (options?: SecondParameter<typeof request>, signal?: AbortSignal) => {
  return request<GetUserProfile200>({ url: `/users/me`, method: "GET", signal }, options)
}

export const getGetUserProfileQueryKey = () => {
  return [`/users/me`] as const
}

export const getGetUserProfileQueryOptions = <
  TData = Awaited<ReturnType<typeof getUserProfile>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserProfile>>, TError, TData>>
  request?: SecondParameter<typeof request>
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey = queryOptions?.queryKey ?? getGetUserProfileQueryKey()

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUserProfile>>> = ({ signal }) =>
    getUserProfile(requestOptions, signal)

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getUserProfile>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetUserProfileQueryResult = NonNullable<Awaited<ReturnType<typeof getUserProfile>>>
export type GetUserProfileQueryError = ErrorType<unknown>

export function useGetUserProfile<TData = Awaited<ReturnType<typeof getUserProfile>>, TError = ErrorType<unknown>>(
  options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserProfile>>, TError, TData>> &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUserProfile>>,
          TError,
          Awaited<ReturnType<typeof getUserProfile>>
        >,
        "initialData"
      >
    request?: SecondParameter<typeof request>
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetUserProfile<TData = Awaited<ReturnType<typeof getUserProfile>>, TError = ErrorType<unknown>>(
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserProfile>>, TError, TData>> &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUserProfile>>,
          TError,
          Awaited<ReturnType<typeof getUserProfile>>
        >,
        "initialData"
      >
    request?: SecondParameter<typeof request>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetUserProfile<TData = Awaited<ReturnType<typeof getUserProfile>>, TError = ErrorType<unknown>>(
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserProfile>>, TError, TData>>
    request?: SecondParameter<typeof request>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetUserProfile<TData = Awaited<ReturnType<typeof getUserProfile>>, TError = ErrorType<unknown>>(
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserProfile>>, TError, TData>>
    request?: SecondParameter<typeof request>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {
  const queryOptions = getGetUserProfileQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>
  }

  query.queryKey = queryOptions.queryKey

  return query
}

/**
 * Update user profile
 */
export const updateUserProfile = (
  updateUserProfileBody: UpdateUserProfileBody,
  options?: SecondParameter<typeof request>,
) => {
  return request<UpdateUserProfile200>(
    { url: `/users/me`, method: "PATCH", headers: { "Content-Type": "application/json" }, data: updateUserProfileBody },
    options,
  )
}

export const getUpdateUserProfileMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateUserProfile>>,
    TError,
    { data: UpdateUserProfileBody },
    TContext
  >
  request?: SecondParameter<typeof request>
}): UseMutationOptions<
  Awaited<ReturnType<typeof updateUserProfile>>,
  TError,
  { data: UpdateUserProfileBody },
  TContext
> => {
  const mutationKey = ["updateUserProfile"]
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateUserProfile>>, { data: UpdateUserProfileBody }> = (
    props,
  ) => {
    const { data } = props ?? {}

    return updateUserProfile(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type UpdateUserProfileMutationResult = NonNullable<Awaited<ReturnType<typeof updateUserProfile>>>
export type UpdateUserProfileMutationBody = UpdateUserProfileBody
export type UpdateUserProfileMutationError = ErrorType<unknown>

export const useUpdateUserProfile = <TError = ErrorType<unknown>, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof updateUserProfile>>,
      TError,
      { data: UpdateUserProfileBody },
      TContext
    >
    request?: SecondParameter<typeof request>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof updateUserProfile>>,
  TError,
  { data: UpdateUserProfileBody },
  TContext
> => {
  const mutationOptions = getUpdateUserProfileMutationOptions(options)

  return useMutation(mutationOptions, queryClient)
}
/**
 * Upload a profile image
 */
export const uploadProfileImage = (options?: SecondParameter<typeof request>) => {
  return request<UploadProfileImage200>({ url: `/users/profile-image`, method: "PUT" }, options)
}

export const getUploadProfileImageMutationOptions = <
  TError = ErrorType<UploadProfileImage400 | UploadProfileImage500>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<Awaited<ReturnType<typeof uploadProfileImage>>, TError, void, TContext>
  request?: SecondParameter<typeof request>
}): UseMutationOptions<Awaited<ReturnType<typeof uploadProfileImage>>, TError, void, TContext> => {
  const mutationKey = ["uploadProfileImage"]
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof uploadProfileImage>>, void> = () => {
    return uploadProfileImage(requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type UploadProfileImageMutationResult = NonNullable<Awaited<ReturnType<typeof uploadProfileImage>>>

export type UploadProfileImageMutationError = ErrorType<UploadProfileImage400 | UploadProfileImage500>

export const useUploadProfileImage = <
  TError = ErrorType<UploadProfileImage400 | UploadProfileImage500>,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof uploadProfileImage>>, TError, void, TContext>
    request?: SecondParameter<typeof request>
  },
  queryClient?: QueryClient,
): UseMutationResult<Awaited<ReturnType<typeof uploadProfileImage>>, TError, void, TContext> => {
  const mutationOptions = getUploadProfileImageMutationOptions(options)

  return useMutation(mutationOptions, queryClient)
}
/**
 * Delete a profile image
 */
export const deleteProfileImage = (options?: SecondParameter<typeof request>) => {
  return request<DeleteProfileImage200>({ url: `/users/profile-image`, method: "DELETE" }, options)
}

export const getDeleteProfileImageMutationOptions = <
  TError = ErrorType<DeleteProfileImage404>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteProfileImage>>, TError, void, TContext>
  request?: SecondParameter<typeof request>
}): UseMutationOptions<Awaited<ReturnType<typeof deleteProfileImage>>, TError, void, TContext> => {
  const mutationKey = ["deleteProfileImage"]
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteProfileImage>>, void> = () => {
    return deleteProfileImage(requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type DeleteProfileImageMutationResult = NonNullable<Awaited<ReturnType<typeof deleteProfileImage>>>

export type DeleteProfileImageMutationError = ErrorType<DeleteProfileImage404>

export const useDeleteProfileImage = <TError = ErrorType<DeleteProfileImage404>, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteProfileImage>>, TError, void, TContext>
    request?: SecondParameter<typeof request>
  },
  queryClient?: QueryClient,
): UseMutationResult<Awaited<ReturnType<typeof deleteProfileImage>>, TError, void, TContext> => {
  const mutationOptions = getDeleteProfileImageMutationOptions(options)

  return useMutation(mutationOptions, queryClient)
}
