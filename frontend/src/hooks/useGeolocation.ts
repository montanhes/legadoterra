import { useState } from 'react'

interface Coords {
  lat: number
  lng: number
}

export function useGeolocation(initial?: Coords | null) {
  const [coords, setCoords] = useState<Coords | null>(initial ?? null)
  const [error, setError] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  function locate() {
    setError(null)
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude })
        setIsLocating(false)
      },
      () => {
        setError('Não conseguimos acessar sua localização.')
        setIsLocating(false)
      },
    )
  }

  return { coords, setCoords, error, isLocating, locate }
}
