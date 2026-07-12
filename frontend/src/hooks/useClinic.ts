import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api, ensureCsrfCookie } from '../lib/api'
import { authUserKey } from './useAuth'
import type { BloodType, DonorProfile, User } from '../types/api'

interface RegisterClinicPayload {
  owner_name: string
  email: string
  password: string
  password_confirmation: string
  clinic_name: string
  phone: string
  city?: string
  cep?: string
  lat?: number
  lng?: number
}

export function useRegisterClinic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: RegisterClinicPayload) => {
      await ensureCsrfCookie()
      await api.post('/api/clinics/register', payload)
      const response = await api.get<{ data: User }>('/api/user')
      return response.data.data
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authUserKey, user)
    },
  })
}

interface ConfirmTypingPayload {
  code: string
  blood_type: BloodType
}

export function useConfirmTyping() {
  return useMutation({
    mutationFn: async (payload: ConfirmTypingPayload) => {
      const response = await api.post<{ data: DonorProfile }>('/api/typing-confirmations', payload)
      return response.data.data
    },
  })
}
