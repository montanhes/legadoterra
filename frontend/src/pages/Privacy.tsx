export default function Privacy() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16 md:py-24">
      <div>
        <p className="font-mono text-sm text-muted-foreground">LGPD</p>
        <h1 className="mt-2 font-display text-4xl">Política de Privacidade</h1>
        <p className="mt-3 text-sm text-muted-foreground">Última atualização: julho de 2026.</p>
      </div>

      <div className="flex flex-col gap-6 leading-relaxed text-foreground">
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-xl">Quem é o controlador dos seus dados</h2>
          <p>
            O Legado Terra é operado por Ramon Carvalho (pessoa física). Dúvidas, solicitações ou
            reclamações sobre seus dados podem ser enviadas para{' '}
            <a href="mailto:contato@legadoterra.com.br" className="text-foreground underline">
              contato@legadoterra.com.br
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-xl">Quais dados coletamos</h2>
          <p>
            <strong>Do tutor:</strong> nome, e-mail, senha (armazenada com hash, nunca em texto
            plano), telefone e localização (CEP/cidade/estado e coordenadas de latitude e
            longitude).
          </p>
          <p>
            <strong>Do pet:</strong> nome, espécie, sexo, raça, peso, data de nascimento, foto,
            localização, tipo sanguíneo e status de tipagem.
          </p>
          <p>
            <strong>Da clínica</strong> (quando aplicável): nome da clínica, nome do responsável,
            telefone e cidade.
          </p>
          <p>
            <strong>Login com Google:</strong> ao entrar com sua conta Google, recebemos seu nome e
            e-mail diretamente do Google, só pra autenticação — não temos acesso à sua senha do
            Google nem a outros dados da sua conta.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-xl">Para que usamos esses dados</h2>
          <p>
            Pra conectar tutores que precisam de uma transfusão com tutores de pets doadores
            compatíveis, calcular distância entre eles, e permitir que clínicas parceiras
            confirmem a tipagem sanguínea dos pets cadastrados como doadores.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-xl">Compartilhamento do seu telefone com outros usuários</h2>
          <p>
            Seu telefone nunca aparece pra outros usuários por padrão. Existem dois jeitos dele ser
            compartilhado, dependendo do fluxo:
          </p>
          <p>
            <strong>Busca de doador:</strong> quem busca um doador não vê seu telefone direto. A
            pessoa pode solicitar contato; você recebe essa solicitação e decide se aceita ou
            recusa. Só depois que você aceita, seu telefone fica visível pra quem pediu — e só pra
            essa pessoa.
          </p>
          <p>
            <strong>Pedido de emergência (SOS):</strong> ao publicar um pedido de emergência, você
            escolhe (com uma opção marcada por padrão, já que velocidade importa numa emergência)
            se quer que seu telefone apareça direto pra quem pode ajudar, sem precisar de um pedido
            de aprovação prévio. Você pode desmarcar essa opção a qualquer momento, no formulário do
            pedido.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-xl">Localização</h2>
          <p>
            Guardamos a coordenada real do seu pet ou do seu endereço pra calcular distância nas
            buscas. Na exibição pública dos resultados de busca, porém, a coordenada mostrada é
            deslocada aleatoriamente entre 50 e 400 metros — o suficiente pra não expor seu
            endereço exato, mas sem atrapalhar a busca por proximidade.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-xl">Cookies e analytics</h2>
          <p>
            Usamos o Umami, uma ferramenta de analytics auto-hospedada (não é Google Analytics nem
            similar), que não usa cookies de rastreamento e não coleta dados que identifiquem você
            pessoalmente.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-xl">Por quanto tempo guardamos seus dados</h2>
          <p>
            Enquanto sua conta existir. Se você solicitar a exclusão da conta, seus dados pessoais
            de perfil — pets, localização, telefone, e-mail de contato — são removidos
            permanentemente. A única exceção é o registro mínimo de auditoria descrito abaixo.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-xl">Registro de auditoria e segurança</h2>
          <p>
            Mantemos um registro interno de ações relevantes na plataforma (criação, edição e
            exclusão de cadastros de pet, pedidos de emergência e solicitações de contato),
            incluindo o e-mail de quem realizou a ação e o endereço IP de origem. Esse registro
            existe pra cumprir obrigação legal de guarda de registros de acesso a aplicações de
            internet (art. 15 da Lei 12.965/2014, o Marco Civil da Internet) e pra permitir que a
            plataforma colabore com investigação formal de fraude, abuso ou crime, quando
            solicitada pela autoridade competente (art. 7º, VI, LGPD).
          </p>
          <p>
            Esse registro <strong>não é apagado quando você exclui sua conta</strong> — é
            justamente o que permite reconstruir o que aconteceu mesmo depois da exclusão. Ele não
            fica acessível a outros usuários da plataforma em nenhuma hipótese, e é mantido por até
            12 meses, sendo descartado automaticamente depois disso.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-xl">Seus direitos</h2>
          <p>Como titular dos dados, você pode a qualquer momento:</p>
          <ul className="ml-5 list-disc">
            <li>confirmar se tratamos seus dados e acessá-los;</li>
            <li>corrigir dados incompletos, desatualizados ou incorretos;</li>
            <li>solicitar a exclusão dos seus dados;</li>
            <li>pedir a portabilidade dos seus dados pra outro serviço;</li>
            <li>revogar consentimentos que você deu (como o compartilhamento de telefone);</li>
            <li>saber com quem compartilhamos seus dados.</li>
          </ul>
          <p>
            Pra exercer qualquer um desses direitos, escreva pra{' '}
            <a href="mailto:contato@legadoterra.com.br" className="text-foreground underline">
              contato@legadoterra.com.br
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-xl">Base legal</h2>
          <p>
            Tratamos seus dados com base na execução do serviço que você contratou ao criar sua
            conta (art. 7º, V, LGPD) e, pra funcionalidades específicas e opcionais — como o
            compartilhamento automático de telefone em pedidos de emergência —, com base no seu
            consentimento (art. 7º, I, LGPD), que pode ser revogado a qualquer momento.
          </p>
        </section>
      </div>
    </div>
  )
}
