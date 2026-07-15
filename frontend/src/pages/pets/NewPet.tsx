import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import DateField from '../../components/form/DateField'
import SelectField from '../../components/form/SelectField'
import TextField from '../../components/form/TextField'
import { useUser } from '../../hooks/useAuth'
import { useCreatePet } from '../../hooks/usePets'
import { brDateToIso, isValidBrDate } from '../../lib/date'
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

export default function NewPet() {
  const createPet = useCreatePet()
  const { data: user } = useUser()
  const navigate = useNavigate()
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [geoError, setGeoError] = useState<string | null>(null)

  const hasLocation = Boolean(coords ?? (user?.lat && user?.lng))

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  function useMyLocation() {
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude })
      },
      () => setGeoError('Não conseguimos acessar sua localização.'),
    )
  }

  async function onSubmit(values: FormValues) {
    const pet = await createPet.mutateAsync({
      name: values.name,
      species: Number(values.species) as Species,
      sex: Number(values.sex) as Sex,
      breed: values.breed || undefined,
      weight: values.weight ? Number(values.weight) : undefined,
      birthdate: values.birthdate ? brDateToIso(values.birthdate) : undefined,
      castrado: values.castrado,
      ...coords,
    })
    navigate(`/painel/pets/${pet.id}`)
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-6 py-16 md:py-24">
      <h1 className="font-display text-3xl">Novo pet</h1>

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

        {!hasLocation && (
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={useMyLocation}
              className="w-fit rounded-full border border-input px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              usar minha localização
            </button>
            {geoError && <span className="text-sm text-destructive">{geoError}</span>}
            <span className="text-xs text-muted-foreground">
              Precisamos da localização do pet pra ele aparecer nas buscas por doador.
            </span>
          </div>
        )}

        {createPet.isError && (
          <p className="text-sm text-destructive">{getApiErrorMessage(createPet.error)}</p>
        )}

        <button
          type="submit"
          disabled={createPet.isPending}
          className="mt-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {createPet.isPending ? 'Salvando...' : 'Cadastrar pet'}
        </button>
      </form>
    </div>
  )
}
