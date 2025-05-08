import axios from 'axios'

export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      const message = error.response.data.message
      if (Array.isArray(message)) {
        return message.join(', ')
      }
      return message
    }

    return error.response?.statusText || 'An unknown server error occurred'
  }

  if (error instanceof Error) {
    return error.message
  }
  return 'An unknown error occurred'
}
