import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import GoogleLoginButton from '../components/GoogleLoginButton'
import PhoneField from '../components/form/PhoneField'
import TextField from '../components/form/TextField'
import { useRegister } from '../hooks/useAuth'
import { getApiErrorMessage } from '../lib/errors'

const schema = z
  .object({
    name: z.string().min(1, 'Informe seu nome.'),
    email: z.string().email('Informe um e-mail válido.'),
    phone: z.string().optional(),
    password: z.string().min(8, 'Mínimo de 8 caracteres.'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'As senhas não coincidem.',
    path: ['password_confirmation'],
  })

type FormValues = z.infer<typeof schema>

export default function Register() {
  const register_ = useRegister()
  const navigate = useNavigate()
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [geoError, setGeoError] = useState<string | null>(null)

  const {
    register,
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
    await register_.mutateAsync({ ...values, ...coords })
    navigate('/painel', { replace: true })
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-6 py-16 md:py-24">
      <h1 className="font-display text-3xl">Criar conta</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextField label="Nome" registration={register('name')} error={errors.name?.message} />
        <TextField
          label="E-mail"
          type="email"
          registration={register('email')}
          error={errors.email?.message}
        />
        <PhoneField
          label="Telefone (WhatsApp)"
          placeholder="(11) 99999-9999"
          registration={register('phone')}
          error={errors.phone?.message}
        />
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
            onClick={useMyLocation}
            className="w-fit rounded-full border border-input px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            {coords ? '✓ localização capturada' : 'usar minha localização'}
          </button>
          {geoError && <span className="text-sm text-destructive">{geoError}</span>}
          <span className="text-xs text-muted-foreground">
            Usamos sua localização pra achar doadores perto de você. Pode pular e definir depois.
          </span>
        </div>

        {register_.isError && (
          <p className="text-sm text-destructive">{getApiErrorMessage(register_.error)}</p>
        )}

        <button
          type="submit"
          disabled={register_.isPending}
          className="mt-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {register_.isPending ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        ou
        <div className="h-px flex-1 bg-border" />
      </div>

      <GoogleLoginButton />

      <p className="text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link to="/entrar" className="text-foreground underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
