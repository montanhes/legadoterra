import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useUser } from '../../hooks/useAuth'
import { useConfirmTyping } from '../../hooks/useClinic'
import { getApiErrorMessage } from '../../lib/errors'
import { BloodType, Species, bloodTypeLabels, bloodTypesBySpecies } from '../../types/api'

const schema = z.object({
  code: z.string().length(6, 'O código tem 6 dígitos.'),
  blood_type: z.string().min(1, 'Selecione o tipo sanguíneo.'),
})

type FormValues = z.infer<typeof schema>

export default function ConfirmTyping() {
  const { data: user } = useUser()
  const confirmTyping = useConfirmTyping()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  if (!user?.clinic?.verified) {
    return (
      <div className="mx-auto max-w-sm px-6 py-24">
        <h1 className="font-display text-3xl">{user?.clinic?.name}</h1>
        <p className="mt-4 rounded-xl border border-border bg-card p-4 text-muted-foreground">
          Sua clínica ainda está aguardando aprovação. Assim que verificarmos o cadastro, você
          poderá confirmar tipagens por aqui.
        </p>
      </div>
    )
  }

  async function onSubmit(values: FormValues) {
    await confirmTyping.mutateAsync({
      code: values.code,
      blood_type: Number(values.blood_type) as BloodType,
    })
    reset()
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-6 py-24">
      <div>
        <h1 className="font-display text-3xl">{user.clinic.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Peça o código de 6 dígitos pro tutor e confirme o tipo sanguíneo do pet.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">Código</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            className="rounded-lg border border-input bg-card px-4 py-2.5 font-mono text-lg tracking-widest text-foreground placeholder:text-muted-foreground focus:ring-ring focus:outline-none focus:ring-2"
            {...register('code')}
          />
          {errors.code?.message && (
            <span className="text-sm text-destructive">{errors.code.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">Tipo sanguíneo</label>
          <select
            className="rounded-lg border border-input bg-card px-4 py-2.5 text-foreground focus:ring-ring focus:outline-none focus:ring-2"
            defaultValue=""
            {...register('blood_type')}
          >
            <option value="" disabled>
              Selecione
            </option>
            <optgroup label="Cão">
              {bloodTypesBySpecies[Species.Cao].map((bt) => (
                <option key={bt} value={bt}>
                  {bloodTypeLabels[bt]}
                </option>
              ))}
            </optgroup>
            <optgroup label="Gato">
              {bloodTypesBySpecies[Species.Gato].map((bt) => (
                <option key={bt} value={bt}>
                  {bloodTypeLabels[bt]}
                </option>
              ))}
            </optgroup>
          </select>
          {errors.blood_type?.message && (
            <span className="text-sm text-destructive">{errors.blood_type.message}</span>
          )}
        </div>

        {confirmTyping.isError && (
          <p className="text-sm text-destructive">{getApiErrorMessage(confirmTyping.error)}</p>
        )}

        {confirmTyping.isSuccess && (
          <p className="rounded-lg bg-primary/10 p-3 text-sm text-primary">
            Tipagem confirmada — {confirmTyping.data.blood_type_label}. Status do pet agora:{' '}
            {confirmTyping.data.eligibility_status_label}.
          </p>
        )}

        <button
          type="submit"
          disabled={confirmTyping.isPending}
          className="mt-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {confirmTyping.isPending ? 'Confirmando...' : 'Confirmar tipagem'}
        </button>
      </form>
    </div>
  )
}
