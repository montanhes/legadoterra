import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { ContactRequest, ContactRequestStatus } from '../types/api'

export const contactRequestsKey = ['contact-requests'] as const

export function useContactRequests() {
  return useQuery({
    queryKey: contactRequestsKey,
    queryFn: async () => {
      const response = await api.get<{ data: ContactRequest[] }>('/api/contact-requests')
      return response.data.data
    },
    refetchInterval: 30_000,
  })
}

export function useCreateContactRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (petId: number) => {
      const response = await api.post<{ data: ContactRequest }>('/api/contact-requests', {
        pet_id: petId,
      })
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactRequestsKey })
      queryClient.invalidateQueries({ queryKey: ['donors'] })
    },
  })
}

export function useRespondContactRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: ContactRequestStatus }) => {
      const response = await api.patch<{ data: ContactRequest }>(`/api/contact-requests/${id}`, {
        status,
      })
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactRequestsKey })
    },
  })
}
