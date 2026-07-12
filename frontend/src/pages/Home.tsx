import { Link } from 'react-router'
import { useUser } from '../hooks/useAuth'

export default function Home() {
  const { data: user } = useUser()

  return (
    <div className="min-h-svh bg-background text-foreground">
      <section className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-24">
        <p className="font-mono text-sm tracking-wide text-muted-foreground">legado terra</p>
        <h1 className="font-display text-5xl leading-tight text-balance md:text-6xl">
          Um doador perto de você pode salvar a vida que você mais ama.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Cadastre seu pet como doador de sangue e ajude tutores a encontrar ajuda na hora que
          mais precisam.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Link
            to={user ? '/painel/pets/novo' : '/cadastro'}
            className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Cadastrar meu pet
          </Link>
          <Link
            to={user ? '/buscar' : '/cadastro'}
            className="rounded-full bg-donate px-6 py-3 font-medium text-donate-foreground transition-opacity hover:opacity-90"
          >
            Preciso de um doador
          </Link>
        </div>
      </section>
    </div>
  )
}
