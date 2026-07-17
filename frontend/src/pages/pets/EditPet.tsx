import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { z } from 'zod'
import DateField from '../../components/form/DateField'
import SelectField from '../../components/form/SelectField'
import TextField from '../../components/form/TextField'
import { useUpdatePet, usePet } from '../../hooks/usePets'
import { brDateToIso, isValidBrDate, isoDateToBr } from '../../lib/date'
import { getApiErrorMessage } from '../../lib/errors'
import { Sex, Species, sexLabels, speciesLabels } from '../../types/api'

const schema = z.object({
  name: z.string().min(1, 'Informe o nome do pet.'),
  species: z.string().min(1, 'Selecione a espécie.'),
  sex: z.string().min(1, 'Selecione o sexo.'),
  breed: z.string().optional(),
  weight: z.string().optional(),
  birthdate: z
    .string()
    .optional()
    .refine((value) => !value || isValidBrDate(value), 'Data inválida.'),
  castrado: z.boolean().optional(),
})

type FormValues = z.infer<typeof schema>

export default function EditPet() {
  const { id } = useParams()
  const petId = Number(id)
  const navigate = useNavigate()

  const { data: pet, isLoading } = usePet(petId)
  const updatePet = useUpdatePet(petId)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: pet
      ? {
          name: pet.name,
          species: String(pet.species),
          sex: String(pet.sex),
          breed: pet.breed ?? '',
          weight: pet.weight ?? '',
          birthdate: pet.birthdate ? isoDateToBr(pet.birthdate) : '',
          castrado: pet.castrado,
        }
      : undefined,
  })

  if (isLoading || !pet) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24 text-muted-foreground">
        carregando...
      </div>
    )
  }

  async function onSubmit(values: FormValues) {
    await updatePet.mutateAsync({
      name: values.name,
      species: Number(values.species) as Species,
      sex: Number(values.sex) as Sex,
      breed: values.breed || undefined,
      weight: values.weight ? Number(values.weight) : undefined,
      birthdate: values.birthdate ? brDateToIso(values.birthdate) : undefined,
      castrado: values.castrado,
    })
    navigate(`/painel/pets/${petId}`)
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <div className="mx-auto flex max-w-sm flex-col gap-6">
        <h1 className="font-display text-3xl">Editar {pet.name}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <TextField label="Nome" registration={register('name')} error={errors.name?.message} />

          <SelectField
            label="Espécie"
            registration={register('species')}
            placeholder="Selecione"
            options={Object.entries(speciesLabels).map(([value, label]) => ({ value, label }))}
            error={errors.species?.message}
          />

          <SelectField
            label="Sexo"
            registration={register('sex')}
            placeholder="Selecione"
            options={Object.entries(sexLabels).map(([value, label]) => ({ value, label }))}
            error={errors.sex?.message}
          />

          <TextField label="Raça (opcional)" registration={register('breed')} />
          <TextField
            label="Peso em kg (opcional)"
            type="number"
            registration={register('weight')}
            error={errors.weight?.message}
          />
          <DateField
            label="Data de nascimento (opcional)"
            name="birthdate"
            control={control}
            error={errors.birthdate?.message}
          />

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" {...register('castrado')} />
            Castrado(a)
          </label>

          {updatePet.isError && (
            <p className="text-sm text-destructive">{getApiErrorMessage(updatePet.error)}</p>
          )}

          <button
            type="submit"
            disabled={updatePet.isPending}
            className="mt-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
          >
            {updatePet.isPending ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>
    </div>
  )
}
