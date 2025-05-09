import Axios, { type AxiosRequestConfig, type AxiosError } from "axios"
import { getTokenCookie } from "./token"

export const axiosInstance = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getTokenCookie()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function mergeConfig(config: AxiosRequestConfig, options?: AxiosRequestConfig): AxiosRequestConfig {
  const merged = { ...config, ...options }
  merged.headers = {
    "Content-Type": "application/json",
    ...merged.headers,
  }

  if (merged.data instanceof FormData) {
    delete merged.headers["Content-Type"]
  } else if (!merged.data) {
    merged.data = {}
  }

  return merged
}

export const request = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  const merged = mergeConfig(config, options)
  const source = Axios.CancelToken.source()
  const p = axiosInstance({ ...merged, cancelToken: source.token }).then((res) => res.data)

  // @ts-ignore
  p.cancel = () => source.cancel("Query was cancelled")

  return p
}

export const requestSafe = <T, E = unknown>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<[AxiosError<E>, undefined] | [undefined, T]> => {
  const merged = mergeConfig(config, options)
  const source = Axios.CancelToken.source()
  const p = axiosInstance({ ...merged, cancelToken: source.token })
    .then(({ data }) => [undefined, data] as [undefined, T])
    .catch((err: AxiosError<E>) => [err, undefined] as [AxiosError<E>, undefined])

  // @ts-ignore
  p.cancel = () => source.cancel("Query was cancelled")

  return p
}

export type ErrorType<Error> = AxiosError<Error>
