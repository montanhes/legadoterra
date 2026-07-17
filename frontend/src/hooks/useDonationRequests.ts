import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { BloodType, DonationRequestSearchResult, DonationType, Species } from '../types/api'

interface DonationRequestSearchParams {
  lat: number
  lng: number
  radiusKm: number
  species?: Species
}

export function useDonationRequestSearch(params: DonationRequestSearchParams | null) {
  return useQuery({
    queryKey: ['donation-requests', params],
    queryFn: async () => {
      const response = await api.get<{ data: DonationRequestSearchResult[] }>(
        '/api/donation-requests',
        {
          params: {
            lat: params!.lat,
            lng: params!.lng,
            radius_km: params!.radiusKm,
            species: params!.species,
          },
        },
      )
      return response.data.data
    },
    enabled: params !== null,
  })
}

interface CreateDonationRequestPayload {
  pet_id: number
  donation_type: DonationType
  blood_type_needed?: BloodType | null
  share_phone?: boolean
  lat?: number
  lng?: number
}

export function useCreateDonationRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateDonationRequestPayload) => {
      const response = await api.post('/api/donation-requests', payload)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donation-requests'] })
    },
  })
}
