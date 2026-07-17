import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { z } from 'zod'
import GoogleLoginButton from '../components/GoogleLoginButton'
import TextField from '../components/form/TextField'
import { useLogin } from '../hooks/useAuth'
import { getApiErrorMessage } from '../lib/errors'

const schema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(1, 'Informe sua senha.'),
})

type FormValues = z.infer<typeof schema>

export default function Login() {
  const login = useLogin()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    await login.mutateAsync(values)
    const from = (location.state as { from?: Location })?.from?.pathname ?? '/painel'
    navigate(from, { replace: true })
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <div className="mx-auto flex max-w-sm flex-col gap-6">
        <h1 className="font-display text-3xl">Entrar</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <TextField
            label="E-mail"
            type="email"
            registration={register('email')}
            error={errors.email?.message}
          />
          <TextField
            label="Senha"
            type="password"
            registration={register('password')}
            error={errors.password?.message}
          />

          {login.isError && (
            <p className="text-sm text-destructive">{getApiErrorMessage(login.error)}</p>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="mt-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
          >
            {login.isPending ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          ou
          <div className="h-px flex-1 bg-border" />
        </div>

        <GoogleLoginButton />

        <p className="text-sm text-muted-foreground">
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="text-foreground underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
