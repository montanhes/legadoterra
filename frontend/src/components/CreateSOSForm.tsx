import { type FormEvent, useState } from 'react'
import { useCreateDonationRequest } from '../hooks/useDonationRequests'
import { getApiErrorMessage } from '../lib/errors'
import { DonationType, type BloodType, type Pet, bloodTypeLabels, bloodTypesBySpecies } from '../types/api'

interface CreateSOSFormProps {
  pets: Pet[]
  onCreated: () => void
  onCancel: () => void
}

export default function CreateSOSForm({ pets, onCreated, onCancel }: CreateSOSFormProps) {
  const createSOS = useCreateDonationRequest()
  const [petId, setPetId] = useState('')
  const [bloodType, setBloodType] = useState('')
  const [sharePhone, setSharePhone] = useState(true)

  const selectedPet = pets.find((pet) => pet.id === Number(petId))

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!petId) return

    await createSOS.mutateAsync({
      pet_id: Number(petId),
      donation_type: DonationType.SangueTotal,
      blood_type_needed: bloodType ? (Number(bloodType) as BloodType) : null,
      share_phone: sharePhone,
    })
    onCreated()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
    >
      <h2 className="font-display text-xl">Pedir ajuda</h2>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-muted-foreground">Qual pet precisa?</label>
        <select
          value={petId}
          onChange={(e) => {
            setPetId(e.target.value)
            setBloodType('')
          }}
          className="rounded-lg border border-input bg-background px-4 py-2.5 text-foreground"
        >
          <option value="" disabled>
            Selecione
          </option>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name} ({pet.species_label})
            </option>
          ))}
        </select>
      </div>

      {selectedPet && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">
            Tipo sanguíneo necessário (se souber)
          </label>
          <select
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            className="rounded-lg border border-input bg-background px-4 py-2.5 text-foreground"
          >
            <option value="">Não sei / qualquer</option>
            {bloodTypesBySpecies[selectedPet.species].map((bt) => (
              <option key={bt} value={bt}>
                {bloodTypeLabels[bt]}
              </option>
            ))}
          </select>
        </div>
      )}

      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={sharePhone}
          onChange={(e) => setSharePhone(e.target.checked)}
          className="mt-0.5"
        />
        Permitir que doadores vejam meu telefone direto no pedido (recomendado pra emergência —
        sem isso, quem quiser ajudar não vai conseguir te contatar por aqui)
      </label>

      {createSOS.isError && (
        <p className="text-sm text-destructive">{getApiErrorMessage(createSOS.error)}</p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={!petId || createSOS.isPending}
          className="rounded-full bg-donate px-6 py-3 font-medium text-donate-foreground disabled:opacity-50"
        >
          {createSOS.isPending ? 'Publicando...' : 'Publicar pedido'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-muted-foreground underline"
        >
          cancelar
        </button>
      </div>
    </form>
  )
}
