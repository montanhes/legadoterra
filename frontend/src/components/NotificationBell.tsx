import { useEffect, useRef, useState } from 'react'
import { useContactRequests, useRespondContactRequest } from '../hooks/useContactRequests'
import { ContactRequestStatus } from '../types/api'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { data: contactRequests } = useContactRequests()
  const respond = useRespondContactRequest()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const pendingReceived = (contactRequests ?? []).filter(
    (cr) => cr.direction === 'received' && cr.status === ContactRequestStatus.Pendente,
  )

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notificações"
        aria-expanded={open}
        className="relative text-muted-foreground transition-colors hover:text-foreground"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {pendingReceived.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-donate px-1 text-[10px] font-medium text-donate-foreground">
            {pendingReceived.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 z-20 mt-2 w-72 rounded-xl border border-border bg-card py-2 shadow-lg">
          <p className="px-4 py-2 text-sm font-medium text-foreground">Solicitações de contato</p>

          {pendingReceived.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">Nenhuma solicitação pendente.</p>
          ) : (
            <div className="flex flex-col gap-1 border-t border-border pt-1">
              {pendingReceived.map((cr) => (
                <div key={cr.id} className="flex flex-col gap-2 px-4 py-2">
                  <p className="text-sm text-foreground">
                    <strong>{cr.requester_name}</strong> quer contato sobre {cr.pet.name}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => respond.mutate({ id: cr.id, status: ContactRequestStatus.Aceita })}
                      disabled={respond.isPending}
                      className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground disabled:opacity-50"
                    >
                      Aceitar
                    </button>
                    <button
                      type="button"
                      onClick={() => respond.mutate({ id: cr.id, status: ContactRequestStatus.Recusada })}
                      disabled={respond.isPending}
                      className="rounded-full border border-input px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                    >
                      Recusar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
