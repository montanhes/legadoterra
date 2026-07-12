import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { DonationType, DonorProfile, Pet, Sex, Species } from '../types/api'

export const petsKey = ['pets'] as const
export const petKey = (id: number) => ['pets', id] as const

export function usePets() {
  return useQuery({
    queryKey: petsKey,
    queryFn: async () => {
      const response = await api.get<{ data: Pet[] }>('/api/pets')
      return response.data.data
    },
  })
}

export function usePet(id: number) {
  return useQuery({
    queryKey: petKey(id),
    queryFn: async () => {
      const response = await api.get<{ data: Pet }>(`/api/pets/${id}`)
      return response.data.data
    },
  })
}

interface PetPayload {
  name: string
  species: Species
  sex: Sex
  breed?: string
  weight?: number
  birthdate?: string
  castrado?: boolean
  lat?: number
  lng?: number
}

export function useCreatePet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: PetPayload) => {
      const response = await api.post<{ data: Pet }>('/api/pets', payload)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petsKey })
    },
  })
}

export function useDeletePet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/pets/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petsKey })
    },
  })
}

interface DonorProfilePayload {
  blood_type?: number | null
  typing_status?: number
  donation_types: DonationType[]
}

export function useCreateDonorProfile(petId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: DonorProfilePayload) => {
      const response = await api.post<{ data: DonorProfile }>(
        `/api/pets/${petId}/donor-profile`,
        payload,
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKey(petId) })
    },
  })
}

export function useUpdateDonorProfile(petId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: DonorProfilePayload) => {
      const response = await api.patch<{ data: DonorProfile }>(
        `/api/pets/${petId}/donor-profile`,
        payload,
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKey(petId) })
    },
  })
}
