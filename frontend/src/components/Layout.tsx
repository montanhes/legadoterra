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
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-xl">
            Legado Terra
          </Link>

          <nav className="flex items-center gap-4 font-mono text-sm">
            {isLoading ? null : user?.clinic ? (
              <>
                <Link to="/clinica/confirmar" className="text-muted-foreground hover:text-foreground">
                  confirmar tipagem
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  sair
                </button>
              </>
            ) : user ? (
              <>
                <Link to="/buscar" className="text-muted-foreground hover:text-foreground">
                  buscar
                </Link>
                <Link to="/painel" className="text-muted-foreground hover:text-foreground">
                  meus pets
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/clinica/cadastro"
                  className="text-muted-foreground hover:text-foreground"
                >
                  sou clínica
                </Link>
                <Link to="/entrar" className="text-muted-foreground hover:text-foreground">
                  entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="rounded-full bg-primary px-4 py-2 text-primary-foreground"
                >
                  cadastrar
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
