import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { BloodType, DonorSearchResult, Species } from '../types/api'

interface DonorSearchParams {
  lat: number
  lng: number
  radiusKm: number
  species?: Species
  bloodType?: BloodType
}

export function useDonorSearch(params: DonorSearchParams | null) {
  return useQuery({
    queryKey: ['donors', params],
    queryFn: async () => {
      const response = await api.get<{ data: DonorSearchResult[] }>('/api/donors', {
        params: {
          lat: params!.lat,
          lng: params!.lng,
          radius_km: params!.radiusKm,
          species: params!.species,
          blood_type: params!.bloodType,
        },
      })
      return response.data.data
    },
    enabled: params !== null,
  })
}
