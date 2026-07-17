import { Link } from 'react-router'
import PixDonation from '../components/PixDonation'
import { useUser } from '../hooks/useAuth'

export default function Home() {
  const { data: user } = useUser()

  return (
    <div>
      <section className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16 md:py-24">
        <p className="font-mono text-sm tracking-wide text-muted-foreground">legado terra</p>
        <h1 className="font-display text-4xl leading-tight text-balance sm:text-5xl md:text-6xl">
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

      <section className="border-t border-border bg-card/40 px-6 py-16 md:py-24">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <div className="max-w-xl">
            <p className="font-mono text-sm tracking-wide text-muted-foreground">como funciona</p>
            <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
              Três passos entre um pet e a ajuda que ele precisa.
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col gap-4">
                <span className="font-display text-2xl text-primary">{step.number}</span>
                <h3 className="text-lg font-medium">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-md">
              <p className="font-mono text-sm tracking-wide text-muted-foreground">
                e a clínica veterinária?
              </p>
              <h3 className="mt-2 font-display text-2xl">Confirma a tipagem, valida a doação.</h3>
              <p className="mt-3 text-muted-foreground">
                Depois do contato entre tutores, a doação acontece na clínica. O tutor do doador
                mostra um código de 6 dígitos, e a clínica confirma ali o tipo sanguíneo do pet —
                é isso que atualiza o status dele pra doador confirmado na plataforma.
              </p>
            </div>
            <Link
              to="/clinica/cadastro"
              className="w-fit shrink-0 rounded-full border border-input px-6 py-3 font-medium text-foreground transition-opacity hover:opacity-90"
            >
              Sou clínica
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <PixDonation />
        </div>
      </section>
    </div>
  )
}

const steps = [
  {
    number: '01',
    title: 'Cadastre seu pet',
    description:
      'Conte a tipagem sanguínea do seu pet e onde ele está. Leva poucos minutos e fica salvo pra quando alguém precisar.',
  },
  {
    number: '02',
    title: 'Encontre um doador perto',
    description:
      'Quando a urgência chega, busque por espécie, tipo sanguíneo e distância — e veja doadores no mapa, na hora.',
  },
  {
    number: '03',
    title: 'Conecte e salve uma vida',
    description:
      'Entre em contato direto com o tutor do doador e combine a doação com a clínica. Simples assim.',
  },
]
