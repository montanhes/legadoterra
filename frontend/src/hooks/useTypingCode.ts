import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'

interface TypingCode {
  code: string
  expires_at: string
}

export function useGenerateTypingCode(petId: number) {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post<{ data: TypingCode }>(`/api/pets/${petId}/typing-code`)
      return response.data.data
    },
  })
}
