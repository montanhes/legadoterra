import { Link, Outlet, useNavigate } from 'react-router'
import { useLogout, useUser } from '../hooks/useAuth'

export default function Layout() {
  const { data: user, isLoading } = useUser()
  const logout = useLogout()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout.mutateAsync()
    navigate('/')
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="flex items-center justify-between px-6 py-5 md:px-10">
          <Link to="/" className="font-display text-2xl md:text-3xl">
            Legado Terra
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium md:gap-8">
            <Link to="/sobre" className="text-muted-foreground transition-colors hover:text-foreground">
              Sobre
            </Link>

            {isLoading ? null : user?.clinic ? (
              <>
                <Link
                  to="/clinica/confirmar"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Confirmar tipagem
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                >
                  Sair
                </button>
              </>
            ) : user ? (
              <>
                <Link to="/buscar" className="text-muted-foreground transition-colors hover:text-foreground">
                  Buscar
                </Link>
                <Link to="/painel" className="text-muted-foreground transition-colors hover:text-foreground">
                  Meus pets
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/clinica/cadastro"
                  className="hidden text-muted-foreground transition-colors hover:text-foreground sm:inline"
                >
                  Sou clínica
                </Link>
                <Link to="/entrar" className="text-muted-foreground transition-colors hover:text-foreground">
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="rounded-full bg-primary px-5 py-2.5 text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </nav>
        </div>
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
