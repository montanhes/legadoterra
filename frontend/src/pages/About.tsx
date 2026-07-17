import { Link } from 'react-router'
import PhotoCarousel from '../components/PhotoCarousel'
import PixDonation from '../components/PixDonation'
import { useUser } from '../hooks/useAuth'

const terraPhotos = Array.from({ length: 9 }, (_, i) => ({
  src: `/images/terra/terra${i + 1}.jpg`,
  alt: 'Terra, uma gata preta de olhos verde-oliva',
}))

export default function About() {
  const { data: user } = useUser()

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 md:py-24">
      <div>
        <p className="font-mono text-sm text-muted-foreground">sobre o nome</p>
        <h1 className="mt-2 font-display text-5xl">Terra</h1>
      </div>

      <PhotoCarousel images={terraPhotos} />

      <div className="flex flex-col gap-5 text-lg leading-relaxed text-foreground">
        <p>
          Terra era uma gata preta, toda preta — dos bigodes à ponta do rabo — com dois olhos
          verde-oliva que pareciam guardar luz própria.
        </p>
        <p>
          Ela tinha FeLV, a leucemia felina. Quando a doença avançou, ela precisou de uma
          transfusão de sangue. Não demorou por falta de veterinário, nem por falta de vontade —
          demorou porque não existia um jeito rápido de encontrar um gato doador compatível perto
          o suficiente. Terra não resistiu.
        </p>
        <p>
          O Legado Terra nasceu dessa demora. É uma plataforma pra que isso não precise se
          repetir: tutores cadastram os próprios pets como doadores, e quem precisa encontra ajuda
          perto, rápido, sem depender de sorte.
        </p>
        <p className="text-muted-foreground">
          Cada doador cadastrado aqui é, de um jeito bem literal, uma resposta à pergunta que ficou
          sem resposta a tempo pra Terra: tem alguém que possa ajudar?
        </p>
      </div>

      <Link
        to={user ? '/painel/pets/novo' : '/cadastro'}
        className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground"
      >
        Cadastrar meu pet como doador
      </Link>

      <PixDonation />
    </div>
  )
}
