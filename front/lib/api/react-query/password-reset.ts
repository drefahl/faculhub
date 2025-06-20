/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * API documentation
 * OpenAPI spec version: 1.0.0
 */
import { useMutation } from "@tanstack/react-query"
import type { MutationFunction, QueryClient, UseMutationOptions, UseMutationResult } from "@tanstack/react-query"

import type { RequestPasswordResetBody, ResetPasswordBody } from "./generated.schemas"

import { request } from "../../utils/axios"
import type { ErrorType } from "../../utils/axios"

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1]

export const requestPasswordReset = (
  requestPasswordResetBody: RequestPasswordResetBody,
  options?: SecondParameter<typeof request>,
  signal?: AbortSignal,
) => {
  return request<void>(
    {
      url: `/password-reset/request`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: requestPasswordResetBody,
      signal,
    },
    options,
  )
}

export const getRequestPasswordResetMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof requestPasswordReset>>,
    TError,
    { data: RequestPasswordResetBody },
    TContext
  >
  request?: SecondParameter<typeof request>
}): UseMutationOptions<
  Awaited<ReturnType<typeof requestPasswordReset>>,
  TError,
  { data: RequestPasswordResetBody },
  TContext
> => {
  const mutationKey = ["requestPasswordReset"]
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof requestPasswordReset>>,
    { data: RequestPasswordResetBody }
  > = (props) => {
    const { data } = props ?? {}

    return requestPasswordReset(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type RequestPasswordResetMutationResult = NonNullable<Awaited<ReturnType<typeof requestPasswordReset>>>
export type RequestPasswordResetMutationBody = RequestPasswordResetBody
export type RequestPasswordResetMutationError = ErrorType<unknown>

export const useRequestPasswordReset = <TError = ErrorType<unknown>, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof requestPasswordReset>>,
      TError,
      { data: RequestPasswordResetBody },
      TContext
    >
    request?: SecondParameter<typeof request>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof requestPasswordReset>>,
  TError,
  { data: RequestPasswordResetBody },
  TContext
> => {
  const mutationOptions = getRequestPasswordResetMutationOptions(options)

  return useMutation(mutationOptions, queryClient)
}
export const resetPassword = (
  resetPasswordBody: ResetPasswordBody,
  options?: SecondParameter<typeof request>,
  signal?: AbortSignal,
) => {
  return request<void>(
    {
      url: `/password-reset/reset`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: resetPasswordBody,
      signal,
    },
    options,
  )
}

export const getResetPasswordMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof resetPassword>>,
    TError,
    { data: ResetPasswordBody },
    TContext
  >
  request?: SecondParameter<typeof request>
}): UseMutationOptions<Awaited<ReturnType<typeof resetPassword>>, TError, { data: ResetPasswordBody }, TContext> => {
  const mutationKey = ["resetPassword"]
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof resetPassword>>, { data: ResetPasswordBody }> = (
    props,
  ) => {
    const { data } = props ?? {}

    return resetPassword(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type ResetPasswordMutationResult = NonNullable<Awaited<ReturnType<typeof resetPassword>>>
export type ResetPasswordMutationBody = ResetPasswordBody
export type ResetPasswordMutationError = ErrorType<unknown>

export const useResetPassword = <TError = ErrorType<unknown>, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof resetPassword>>,
      TError,
      { data: ResetPasswordBody },
      TContext
    >
    request?: SecondParameter<typeof request>
  },
  queryClient?: QueryClient,
): UseMutationResult<Awaited<ReturnType<typeof resetPassword>>, TError, { data: ResetPasswordBody }, TContext> => {
  const mutationOptions = getResetPasswordMutationOptions(options)

  return useMutation(mutationOptions, queryClient)
}
