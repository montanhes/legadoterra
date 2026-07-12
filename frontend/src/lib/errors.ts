import { isAxiosError } from 'axios'

interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
}

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? 'Algo deu errado. Tente novamente.'
  }

  return 'Algo deu errado. Tente novamente.'
}

export function getFieldErrors(error: unknown): Record<string, string> {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const errors = error.response?.data?.errors

    if (errors) {
      return Object.fromEntries(
        Object.entries(errors).map(([key, messages]) => [key, messages[0]]),
      )
    }
  }

  return {}
}
