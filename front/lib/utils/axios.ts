import Axios, { type AxiosRequestConfig, type AxiosError } from "axios"
import { getTokenCookie } from "./token"

export const axiosInstance = Axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL })

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getTokenCookie()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const makeRequest = async <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source()

  const promise = axiosInstance({
    ...config,
    ...options,
  }).then(({ data }) => data)

  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled")
  }

  return promise
}

export type ErrorType<Error> = AxiosError<Error>
