import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { useLogout, useUser } from '../hooks/useAuth'
import type { User } from '../types/api'

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

interface AccountMenuProps {
  user: User
  links: { to: string; label: string }[]
}

function AccountMenu({ user, links }: AccountMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const logout = useLogout()
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleLogout() {
    setOpen(false)
    await logout.mutateAsync()
    navigate('/')
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu da conta"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        {user.name.charAt(0).toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-border bg-card py-2 shadow-lg">
          <p className="truncate px-4 py-2 font-medium text-foreground">{user.name}</p>
          <div className="border-t border-border pt-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              disabled={logout.isPending}
              className="block w-full px-4 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function DesktopNav() {
  const { data: user, isLoading } = useUser()
  const linkClassName = 'text-muted-foreground transition-colors hover:text-foreground'

  return (
    <nav className="hidden items-center gap-6 text-sm font-medium md:flex md:gap-8">
      <Link to="/sobre" className={linkClassName}>
        Sobre
      </Link>

      {isLoading ? null : user?.clinic ? (
        <AccountMenu user={user} links={[{ to: '/clinica/confirmar', label: 'Confirmar tipagem' }]} />
      ) : user ? (
        <>
          <Link to="/buscar" className={linkClassName}>
            Buscar
          </Link>
          <AccountMenu user={user} links={[{ to: '/painel', label: 'Meus pets' }]} />
        </>
      ) : (
        <>
          <Link to="/clinica/cadastro" className={linkClassName}>
            Sou clínica
          </Link>
          <Link to="/entrar" className={linkClassName}>
            Entrar
          </Link>
          <Link
            to="/cadastro"
            className="w-fit rounded-full bg-primary px-5 py-2.5 text-primary-foreground transition-opacity hover:opacity-90"
          >
            Cadastrar
          </Link>
        </>
      )}
    </nav>
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
          <Link to="/" className="flex items-center gap-2 font-display text-2xl md:text-3xl">
            <img src="/images/logo.png" alt="" className="h-12 w-12 object-contain md:h-14 md:w-14" />
            Legado Terra
          </Link>

          <DesktopNav />

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
              href="https://www.instagram.com/legadoterra.app"
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
          </div>
        </div>
      </footer>
    </div>
  )
}
