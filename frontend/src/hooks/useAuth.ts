import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, ensureCsrfCookie } from '../lib/api'
import type { User } from '../types/api'

export const authUserKey = ['auth', 'user'] as const

export function useUser() {
  return useQuery({
    queryKey: authUserKey,
    queryFn: async () => {
      const response = await api.get<{ data: User }>('/api/user', {
        validateStatus: (status) => status === 200 || status === 401,
      })

      return response.status === 200 ? response.data.data : null
    },
    staleTime: 5 * 60 * 1000,
  })
}

interface LoginPayload {
  email: string
  password: string
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      await ensureCsrfCookie()
      const response = await api.post<{ data: User }>('/api/login', payload)
      return response.data.data
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authUserKey, user)
    },
  })
}

interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  lat?: number
  lng?: number
}

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      await ensureCsrfCookie()
      const response = await api.post<{ data: User }>('/api/register', payload)
      return response.data.data
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authUserKey, user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await api.post('/api/logout')
    },
    onSuccess: () => {
      queryClient.setQueryData(authUserKey, null)
    },
  })
}
