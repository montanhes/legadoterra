import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import PhoneField from '../../components/form/PhoneField'
import TextField from '../../components/form/TextField'
import { useRegisterClinic } from '../../hooks/useClinic'
import { useGeolocation } from '../../hooks/useGeolocation'
import { getApiErrorMessage } from '../../lib/errors'

const schema = z
  .object({
    owner_name: z.string().min(1, 'Informe o nome do responsável.'),
    email: z.string().email('Informe um e-mail válido.'),
    password: z.string().min(8, 'Mínimo de 8 caracteres.'),
    password_confirmation: z.string(),
    clinic_name: z.string().min(1, 'Informe o nome da clínica.'),
    phone: z.string().min(1, 'Informe um telefone de contato.'),
    city: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'As senhas não coincidem.',
    path: ['password_confirmation'],
  })

type FormValues = z.infer<typeof schema>

export default function RegisterClinic() {
  const registerClinic = useRegisterClinic()
  const navigate = useNavigate()
  const { coords, error: geoError, isLocating, locate } = useGeolocation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    await registerClinic.mutateAsync({ ...values, ...coords })
    navigate('/clinica/confirmar', { replace: true })
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-6 py-16 md:py-24">
      <div>
        <h1 className="font-display text-3xl">Cadastro de clínica</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Depois de aprovada, sua clínica confirma a tipagem sanguínea dos pets atendidos.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextField
          label="Nome da clínica"
          registration={register('clinic_name')}
          error={errors.clinic_name?.message}
        />
        <TextField
          label="Nome do responsável"
          registration={register('owner_name')}
          error={errors.owner_name?.message}
        />
        <TextField
          label="E-mail"
          type="email"
          registration={register('email')}
          error={errors.email?.message}
        />
        <PhoneField
          label="Telefone"
          placeholder="(11) 99999-9999"
          registration={register('phone')}
          error={errors.phone?.message}
        />
        <TextField label="Cidade (opcional)" registration={register('city')} />
        <TextField
          label="Senha"
          type="password"
          registration={register('password')}
          error={errors.password?.message}
        />
        <TextField
          label="Confirmar senha"
          type="password"
          registration={register('password_confirmation')}
          error={errors.password_confirmation?.message}
        />

        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={locate}
            disabled={isLocating}
            className="w-fit rounded-full border border-input px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            {coords ? '✓ localização capturada' : 'usar localização da clínica'}
          </button>
          {geoError && <span className="text-sm text-destructive">{geoError}</span>}
        </div>

        {registerClinic.isError && (
          <p className="text-sm text-destructive">{getApiErrorMessage(registerClinic.error)}</p>
        )}

        <button
          type="submit"
          disabled={registerClinic.isPending}
          className="mt-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {registerClinic.isPending ? 'Enviando...' : 'Cadastrar clínica'}
        </button>
      </form>

      <p className="text-sm text-muted-foreground">
        É tutor?{' '}
        <Link to="/cadastro" className="text-foreground underline">
          Cadastre-se por aqui
        </Link>
      </p>
    </div>
  )
}
