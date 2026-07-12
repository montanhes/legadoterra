import { Link } from 'react-router'
import StatusBadge from '../components/StatusBadge'
import { useUser } from '../hooks/useAuth'
import { usePets } from '../hooks/usePets'

export default function Dashboard() {
  const { data: user } = useUser()
  const { data: pets, isLoading } = usePets()

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Olá, {user?.name}</h1>
        <Link
          to="/painel/pets/novo"
          className="rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground"
        >
          + novo pet
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {isLoading && <p className="text-muted-foreground">carregando...</p>}

        {pets?.length === 0 && (
          <p className="text-muted-foreground">
            Você ainda não cadastrou nenhum pet.{' '}
            <Link to="/painel/pets/novo" className="text-foreground underline">
              Cadastre o primeiro
            </Link>
            .
          </p>
        )}

        {pets?.map((pet) => (
          <Link
            key={pet.id}
            to={`/painel/pets/${pet.id}`}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 hover:border-primary/50"
          >
            <div>
              <p className="font-medium">{pet.name}</p>
              <p className="font-mono text-sm text-muted-foreground">
                {pet.species_label} · {pet.breed ?? 'SRD'}
              </p>
            </div>
            {pet.donor_profile && (
              <StatusBadge
                status={pet.donor_profile.eligibility_status}
                label={pet.donor_profile.eligibility_status_label}
              />
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
