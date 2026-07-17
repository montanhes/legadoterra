import { Link, useNavigate } from 'react-router'
import StatusBadge from '../components/StatusBadge'
import { useDeleteAccount, useUser } from '../hooks/useAuth'
import { useContactRequests, useRespondContactRequest } from '../hooks/useContactRequests'
import { usePets } from '../hooks/usePets'
import { whatsappLink } from '../lib/whatsapp'
import { ContactRequestStatus } from '../types/api'

export default function Dashboard() {
  const { data: user } = useUser()
  const { data: pets, isLoading } = usePets()
  const { data: contactRequests } = useContactRequests()
  const respond = useRespondContactRequest()
  const deleteAccount = useDeleteAccount()
  const navigate = useNavigate()

  const received = contactRequests?.filter((cr) => cr.direction === 'received') ?? []
  const sent = contactRequests?.filter((cr) => cr.direction === 'sent') ?? []

  async function handleDeleteAccount() {
    if (!confirm('Excluir sua conta remove todos os seus dados, pets e histórico do Legado Terra permanentemente. Essa ação não pode ser desfeita. Confirma?')) {
      return
    }
    await deleteAccount.mutateAsync()
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-3xl">Olá, {user?.name}</h1>
        <Link
          to="/painel/pets/novo"
          className="w-fit shrink-0 whitespace-nowrap rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground"
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

      {(received.length > 0 || sent.length > 0) && (
        <div className="mt-12 flex flex-col gap-6">
          <h2 className="font-display text-2xl">Solicitações de contato</h2>

          {received.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">Recebidas</p>
              {received.map((cr) => (
                <div
                  key={cr.id}
                  className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="text-sm">
                    <strong>{cr.requester_name}</strong> quer contato sobre {cr.pet.name}
                  </p>
                  {cr.status === ContactRequestStatus.Pendente ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          respond.mutate({ id: cr.id, status: ContactRequestStatus.Aceita })
                        }
                        disabled={respond.isPending}
                        className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
                      >
                        Aceitar
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          respond.mutate({ id: cr.id, status: ContactRequestStatus.Recusada })
                        }
                        disabled={respond.isPending}
                        className="rounded-full border border-input px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                      >
                        Recusar
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">{cr.status_label}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {sent.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">Enviadas</p>
              {sent.map((cr) => (
                <div
                  key={cr.id}
                  className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="text-sm">
                    Contato sobre <strong>{cr.pet.name}</strong>
                  </p>
                  {cr.status === ContactRequestStatus.Aceita && cr.target_phone ? (
                    <a
                      href={whatsappLink(
                        cr.target_phone,
                        `Olá! Vi no Legado Terra que o(a) ${cr.pet.name} é um doador compatível. Meu pet precisa de ajuda.`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="w-fit rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground"
                    >
                      Chamar no WhatsApp
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">{cr.status_label}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-16 flex flex-col gap-3 rounded-xl border border-destructive/40 p-5">
        <h2 className="font-display text-lg text-destructive">Zona de risco</h2>
        <p className="text-sm text-muted-foreground">
          Excluir sua conta apaga permanentemente: seus dados pessoais (nome, e-mail, telefone,
          localização), todos os seus pets e perfis de doador, seu histórico de pedidos de
          emergência (SOS) e todas as solicitações de contato enviadas ou recebidas. Se você tiver
          uma clínica cadastrada, ela também é excluída. Essa ação não pode ser desfeita.
        </p>
        <button
          type="button"
          onClick={handleDeleteAccount}
          disabled={deleteAccount.isPending}
          className="w-fit rounded-full bg-destructive px-5 py-2.5 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {deleteAccount.isPending ? 'Excluindo conta...' : 'Excluir minha conta'}
        </button>
      </div>
    </div>
  )
}
