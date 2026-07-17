import { useEffect, useState } from 'react'
import CreateSOSForm from '../components/CreateSOSForm'
import DonorMap, { type MapPoint } from '../components/DonorMap'
import { useUser } from '../hooks/useAuth'
import { useCreateContactRequest } from '../hooks/useContactRequests'
import { useDonationRequestSearch } from '../hooks/useDonationRequests'
import { useDonorSearch } from '../hooks/useDonorSearch'
import { useGeolocation } from '../hooks/useGeolocation'
import { usePets } from '../hooks/usePets'
import { whatsappLink } from '../lib/whatsapp'
import {
  ContactRequestStatus,
  type BloodType,
  type Species,
  bloodTypeLabels,
  bloodTypesBySpecies,
  speciesLabels,
} from '../types/api'

type Mode = 'doadores' | 'sos'

export default function Search() {
  const { data: user } = useUser()
  const { data: myPets } = usePets()
  const createContactRequest = useCreateContactRequest()
  const [mode, setMode] = useState<Mode>('doadores')
  const [showSOSForm, setShowSOSForm] = useState(false)
  const [radiusKm, setRadiusKm] = useState(25)
  const [species, setSpecies] = useState<Species | ''>('')
  const [bloodType, setBloodType] = useState<BloodType | ''>('')

  const { coords, error: geoError, isLocating, locate } = useGeolocation(
    user?.lat && user?.lng ? { lat: Number(user.lat), lng: Number(user.lng) } : null,
  )

  useEffect(() => {
    if (!coords) locate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const donorsQuery = useDonorSearch(
    coords && mode === 'doadores'
      ? { lat: coords.lat, lng: coords.lng, radiusKm, species: species || undefined, bloodType: bloodType || undefined }
      : null,
  )

  const sosQuery = useDonationRequestSearch(
    coords && mode === 'sos'
      ? { lat: coords.lat, lng: coords.lng, radiusKm, species: species || undefined }
      : null,
  )

  const isLoading = mode === 'doadores' ? donorsQuery.isLoading : sosQuery.isLoading
  const bloodOptions = species ? bloodTypesBySpecies[species] : []

  const points: MapPoint[] =
    mode === 'doadores'
      ? (donorsQuery.data ?? []).map((d) => ({
          id: d.id,
          lat: d.lat,
          lng: d.lng,
          variant: 'donor' as const,
          label: d.name,
        }))
      : (sosQuery.data ?? []).map((s) => ({
          id: s.id,
          lat: s.lat,
          lng: s.lng,
          variant: 'sos' as const,
          label: s.pet.name,
        }))

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12 md:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 rounded-full border border-border bg-card p-1">
          <button
            onClick={() => setMode('doadores')}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              mode === 'doadores' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            Buscar doador
          </button>
          <button
            onClick={() => setMode('sos')}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              mode === 'sos' ? 'bg-donate text-donate-foreground' : 'text-muted-foreground'
            }`}
          >
            Emergência (SOS)
          </button>
        </div>

        {mode === 'sos' && myPets && myPets.length > 0 && (
          <button
            onClick={() => setShowSOSForm((v) => !v)}
            className="rounded-full bg-donate px-5 py-2.5 font-medium text-donate-foreground"
          >
            {showSOSForm ? 'fechar' : '+ pedir ajuda'}
          </button>
        )}
      </div>

      {mode === 'sos' && showSOSForm && myPets && (
        <CreateSOSForm
          pets={myPets}
          onCreated={() => setShowSOSForm(false)}
          onCancel={() => setShowSOSForm(false)}
        />
      )}

      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Espécie</span>
          <select
            value={species}
            onChange={(e) => {
              setSpecies(e.target.value ? (Number(e.target.value) as Species) : '')
              setBloodType('')
            }}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
          >
            <option value="">Todas</option>
            {Object.entries(speciesLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {mode === 'doadores' && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Tipo sanguíneo</span>
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value ? (Number(e.target.value) as BloodType) : '')}
              disabled={!species}
              className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm disabled:opacity-50"
            >
              <option value="">Qualquer</option>
              {bloodOptions.map((bt) => (
                <option key={bt} value={bt}>
                  {bloodTypeLabels[bt]}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Raio: {radiusKm}km</span>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="w-40 accent-primary"
          />
        </div>

        {!coords && (
          <button
            onClick={locate}
            disabled={isLocating}
            className="rounded-full border border-input px-4 py-2 text-sm hover:border-primary/50"
          >
            {isLocating ? 'localizando...' : 'usar minha localização'}
          </button>
        )}
        {geoError && <span className="text-sm text-destructive">{geoError}</span>}
      </div>

      {!coords ? (
        <p className="text-muted-foreground">Precisamos da sua localização pra buscar por perto.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[3fr_2fr]">
          <div className="h-[420px] overflow-hidden rounded-xl border border-border md:h-[560px] lg:h-[680px]">
            <DonorMap center={coords} points={points} />
          </div>

          <div className="flex flex-col gap-3 md:h-[560px] md:overflow-y-auto md:pr-1 lg:h-[680px]">
            {isLoading && <p className="text-muted-foreground">buscando...</p>}

            {mode === 'doadores' &&
              donorsQuery.data?.map((donor) => (
                <div
                  key={donor.id}
                  className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{donor.name}</p>
                    <span className="font-mono text-xs text-muted-foreground">
                      {donor.distance_km}km
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {donor.species_label} · {donor.breed ?? 'SRD'} ·{' '}
                    {donor.donor_profile.blood_type_label ?? 'tipo não informado'}
                  </p>
                  {donor.contact_status === ContactRequestStatus.Aceita && donor.tutor.phone ? (
                    <a
                      href={whatsappLink(
                        donor.tutor.phone,
                        `Olá! Vi no Legado Terra que o(a) ${donor.name} é um doador compatível. Meu pet precisa de ajuda.`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 w-fit rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                      Pedir contato
                    </a>
                  ) : donor.contact_status === ContactRequestStatus.Pendente ? (
                    <span className="mt-1 w-fit text-sm text-muted-foreground">
                      Aguardando resposta do tutor
                    </span>
                  ) : donor.contact_status === ContactRequestStatus.Recusada ? (
                    <span className="mt-1 w-fit text-sm text-muted-foreground">
                      Solicitação de contato recusada
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => createContactRequest.mutate(donor.id)}
                      disabled={createContactRequest.isPending}
                      className="mt-1 w-fit rounded-full border border-input px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 disabled:opacity-50"
                    >
                      Solicitar contato
                    </button>
                  )}
                </div>
              ))}

            {mode === 'doadores' && donorsQuery.data?.length === 0 && (
              <p className="text-muted-foreground">
                Nenhum doador encontrado nesse raio. Tente aumentar a distância.
              </p>
            )}

            {mode === 'sos' &&
              sosQuery.data?.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{request.pet.name}</p>
                    <span className="font-mono text-xs text-muted-foreground">
                      {request.distance_km}km
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {request.pet.species_label} · {request.blood_type_needed_label ?? 'qualquer tipo'}
                  </p>
                  {request.requester.phone && (
                    <a
                      href={whatsappLink(
                        request.requester.phone,
                        `Olá! Vi no Legado Terra que o(a) ${request.pet.name} precisa de doação. Meu pet pode ajudar!`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 w-fit rounded-full bg-donate px-4 py-2 text-sm font-medium text-donate-foreground"
                    >
                      Posso ajudar
                    </a>
                  )}
                </div>
              ))}

            {mode === 'sos' && sosQuery.data?.length === 0 && (
              <p className="text-muted-foreground">Nenhum pedido de ajuda aberto por perto.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
