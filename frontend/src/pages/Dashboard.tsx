import { useUser } from '../hooks/useAuth'

export default function Dashboard() {
  const { data: user } = useUser()

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-3xl">Olá, {user?.name}</h1>
      <p className="mt-2 text-muted-foreground">Seus pets aparecem aqui.</p>
    </div>
  )
}
