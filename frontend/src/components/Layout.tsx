import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { useLogout, useUser } from '../hooks/useAuth'

interface NavLinksProps {
  linkClassName: string
  onNavigate?: () => void
}

function NavLinks({ linkClassName, onNavigate }: NavLinksProps) {
  const { data: user, isLoading } = useUser()
  const logout = useLogout()
  const navigate = useNavigate()

  async function handleLogout() {
    onNavigate?.()
    await logout.mutateAsync()
    navigate('/')
  }

  return (
    <>
      <Link to="/sobre" onClick={onNavigate} className={linkClassName}>
        Sobre
      </Link>

      {isLoading ? null : user?.clinic ? (
        <>
          <Link to="/clinica/confirmar" onClick={onNavigate} className={linkClassName}>
            Confirmar tipagem
          </Link>
          <button onClick={handleLogout} disabled={logout.isPending} className={`${linkClassName} text-left disabled:opacity-50`}>
            Sair
          </button>
        </>
      ) : user ? (
        <>
          <Link to="/buscar" onClick={onNavigate} className={linkClassName}>
            Buscar
          </Link>
          <Link to="/painel" onClick={onNavigate} className={linkClassName}>
            Meus pets
          </Link>
          <button onClick={handleLogout} disabled={logout.isPending} className={`${linkClassName} text-left disabled:opacity-50`}>
            Sair
          </button>
        </>
      ) : (
        <>
          <Link to="/clinica/cadastro" onClick={onNavigate} className={linkClassName}>
            Sou clínica
          </Link>
          <Link to="/entrar" onClick={onNavigate} className={linkClassName}>
            Entrar
          </Link>
          <Link
            to="/cadastro"
            onClick={onNavigate}
            className="w-fit rounded-full bg-primary px-5 py-2.5 text-primary-foreground transition-opacity hover:opacity-90"
          >
            Cadastrar
          </Link>
        </>
      )}
    </>
  )
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="flex items-center justify-between px-6 py-5 md:px-10">
          <Link to="/" className="font-display text-2xl md:text-3xl">
            Legado Terra
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex md:gap-8">
            <NavLinks linkClassName="text-muted-foreground transition-colors hover:text-foreground" />
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            className="text-foreground md:hidden"
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        {mobileOpen && (
          <nav className="flex flex-col gap-1 border-t border-border px-6 py-4 text-sm font-medium md:hidden">
            <NavLinks
              linkClassName="rounded-lg px-2 py-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onNavigate={() => setMobileOpen(false)}
            />
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border">
        <div className="flex items-center justify-between px-6 py-6 md:px-10">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Legado Terra
          </p>

          <div className="flex items-center gap-4">
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.15" cy="6.85" r="1.05" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter / X"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M18.24 3h2.9l-6.34 7.25L22.5 21h-5.84l-4.57-5.97L6.86 21H3.95l6.78-7.75L2.5 3h5.98l4.13 5.46zm-1.02 16.2h1.6L7.86 4.7H6.14z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
