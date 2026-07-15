import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { z } from 'zod'
import SelectField from '../../components/form/SelectField'
import StatusBadge from '../../components/StatusBadge'
import {
  useCreateDonorProfile,
  useDeletePet,
  usePet,
  useUpdateDonorProfile,
} from '../../hooks/usePets'
import { useGenerateTypingCode } from '../../hooks/useTypingCode'
import { getApiErrorMessage } from '../../lib/errors'
import { DonationType, TypingStatus, bloodTypeLabels, bloodTypesBySpecies } from '../../types/api'

const donorSchema = z.object({
  blood_type: z.string().optional(),
})

type DonorFormValues = z.infer<typeof donorSchema>

export default function PetDetail() {
  const { id } = useParams()
  const petId = Number(id)
  const navigate = useNavigate()

  const { data: pet, isLoading } = usePet(petId)
  const createDonorProfile = useCreateDonorProfile(petId)
  const updateDonorProfile = useUpdateDonorProfile(petId)
  const deletePet = useDeletePet()
  const generateCode = useGenerateTypingCode(petId)

  const {
    register,
    handleSubmit,
  } = useForm<DonorFormValues>({ resolver: zodResolver(donorSchema) })

  if (isLoading || !pet) {
    return <div className="mx-auto max-w-3xl px-6 py-16 md:py-24 text-muted-foreground">carregando...</div>
  }

  const mutation = pet.donor_profile ? updateDonorProfile : createDonorProfile

  async function onSubmitDonor(values: DonorFormValues) {
    const bloodType = values.blood_type ? Number(values.blood_type) : null

    await mutation.mutateAsync({
      blood_type: bloodType,
      typing_status: bloodType ? TypingStatus.Autoinformado : TypingStatus.NaoTestado,
      donation_types: [DonationType.SangueTotal],
    })
  }

  async function handleDelete() {
    if (!confirm(`Remover ${pet!.name}?`)) return
    await deletePet.mutateAsync(petId)
    navigate('/painel')
  }

  const bloodOptions = bloodTypesBySpecies[pet.species].map((bt) => ({
    value: bt,
    label: bloodTypeLabels[bt],
  }))

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-8 px-6 py-16 md:py-24">
      <div>
        <h1 className="font-display text-3xl">{pet.name}</h1>
        <p className="font-mono text-sm text-muted-foreground">
          {pet.species_label} · {pet.sex_label} · {pet.breed ?? 'SRD'}
        </p>
      </div>

      {pet.donor_profile ? (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status de doador</span>
            <StatusBadge
              status={pet.donor_profile.eligibility_status}
              label={pet.donor_profile.eligibility_status_label}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tipagem</span>
            <span className="font-mono text-sm">{pet.donor_profile.typing_status_label}</span>
          </div>
          {pet.donor_profile.blood_type_label && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tipo sanguíneo</span>
              <span className="font-mono text-sm">{pet.donor_profile.blood_type_label}</span>
            </div>
          )}

          {pet.donor_profile.typing_status !== 3 && (
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">
                Leve {pet.name} numa clínica parceira pra confirmar a tipagem e destravar o status
                "apto".
              </p>
              <button
                type="button"
                onClick={() => generateCode.mutate()}
                disabled={generateCode.isPending}
                className="mt-3 rounded-full border border-input px-4 py-2 text-sm hover:border-primary/50"
              >
                {generateCode.isPending ? 'Gerando...' : 'Gerar código pra clínica'}
              </button>
              {generateCode.data && (
                <p className="mt-2 font-mono text-sm">
                  código: <strong>{generateCode.data.code}</strong> · expira{' '}
                  {new Date(generateCode.data.expires_at).toLocaleTimeString('pt-BR')}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground">
          {pet.name} ainda não é candidato a doador.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmitDonor)} className="flex flex-col gap-4">
        <SelectField
          label="Tipo sanguíneo (se souber)"
          registration={register('blood_type')}
          options={[{ value: '', label: 'Não sei' }, ...bloodOptions]}
        />

        {mutation.isError && (
          <p className="text-sm text-destructive">{getApiErrorMessage(mutation.error)}</p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {mutation.isPending
            ? 'Salvando...'
            : pet.donor_profile
              ? 'Atualizar tipagem'
              : 'Tornar candidato a doador'}
        </button>
      </form>

      <button
        type="button"
        onClick={handleDelete}
        className="text-sm text-muted-foreground underline hover:text-destructive"
      >
        remover pet
      </button>
    </div>
  )
}
