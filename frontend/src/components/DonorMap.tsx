import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

export interface MapPoint {
  id: number
  lat: number
  lng: number
  variant: 'donor' | 'sos'
  label: string
}

function pinIcon(variant: 'donor' | 'sos') {
  return L.divIcon({
    className: '',
    html: `<div class="map-pin map-pin-${variant}"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()

  useEffect(() => {
    map.setView([lat, lng])
  }, [lat, lng, map])

  return null
}

interface DonorMapProps {
  center: { lat: number; lng: number }
  points: MapPoint[]
}

export default function DonorMap({ center, points }: DonorMapProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
    >
      <RecenterMap lat={center.lat} lng={center.lng} />
      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {points.map((point) => (
        <Marker
          key={`${point.variant}-${point.id}`}
          position={[point.lat, point.lng]}
          icon={pinIcon(point.variant)}
        >
          <Popup>{point.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
