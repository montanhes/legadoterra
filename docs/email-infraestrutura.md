# Infraestrutura de e-mail (docker-mailserver)

Servidor de e-mail genérico, self-hosted, capaz de atender **N domínios** no mesmo servidor (Oracle Cloud, VM ARM, gerenciado via Coolify). Implantado inicialmente pra `legadoterra.com.br`, mas a arquitetura já suporta adicionar outros domínios (ex: `gamervox.com`) sem precisar de outro servidor.

Este documento serve como referência do que existe hoje **e** como roteiro pra repetir o processo em outro domínio/ambiente.

## Arquitetura

```
Internet ──▶ Security List (Oracle) ──▶ iptables (host) ──▶ docker-mailserver
                                                                  │
                                                    Postfix + Dovecot + Sieve
                                                                  │
                                              ┌───────────────────┴───────────────────┐
                                        entrega local                          relay de saída
                                       (mailbox IMAP)                         (Brevo, porta 587)
                                                                                       │
                                                                              destinatário final
```

- **docker-mailserver** (`ghcr.io/docker-mailserver/docker-mailserver`) — Postfix + Dovecot + Amavis + ClamAV + SpamAssassin + OpenDKIM + OpenDMARC + Fail2ban, tudo num container só. Roda no projeto `infra` do Coolify.
- **certs-dumper** (`ldez/traefik-certs-dumper`) — container companheiro, no mesmo compose do mailserver, que observa o `acme.json` do Traefik (o mesmo proxy que já cuida do HTTPS de todos os outros apps do servidor) e extrai o certificado Let's Encrypt de `mail.<dominio>` pro mailserver usar. Renovação é automática.
- **Relay de saída**: Brevo (plano free), porque a Oracle Cloud bloqueia porta 25 de saída por padrão pra contas criadas após jun/2021 (ver seção "Pegadinhas" abaixo).

## Por que docker-mailserver e não Poste.io/Mailcow

Servidor é **ARM (aarch64)**. `analogic/poste.io` e o Postfix do Mailcow só publicam imagem `amd64` — não sobem em ARM (`exec format error`, crash-loop imediato). `docker-mailserver` publica `amd64` **e** `arm64`. Se o próximo servidor for x86, isso deixa de ser uma restrição, mas dá pra manter o mesmo docker-mailserver de qualquer forma (funciona nas duas arquiteturas).

## Portas e firewall — duas camadas, as duas precisam ser abertas

1. **iptables local** (dentro da VM) — regra `ACCEPT` pra cada porta, inserida **antes** da regra `REJECT` catch-all que várias imagens de VM já vêm com. Persistir com `netfilter-persistent save` (Ubuntu) senão some no reboot.
2. **Security List da Oracle** (nível de rede, fora da VM) — Console OCI → sua VCN → Security List → **Security Rules** → **Add Ingress Rules**. iptables sozinho não basta; sem isso a Oracle derruba o pacote antes de chegar na VM.

Portas necessárias: `25` (SMTP), `587` (submission/STARTTLS), `465` (submission/SSL implícito), `993` (IMAPS), `143` (IMAP), `995`/`110` (POP3, opcional), `4190` (ManageSieve, opcional).

**Saída de porta 25 é bloqueada pela Oracle e não tem solução via Security List** — só via [pedido de aumento de limite de serviço](https://docs.oracle.com/en-us/iaas/Content/Email/Reference/gettingstarted_topic-Create_an_approved_sender.htm) (Console → Governance & Administration → Limits, Quotas and Usage → filtra "smtp" → Actions → Open Support Request), aprovação manual da Oracle, sem prazo garantido. **Não é bloqueante**: o relay de saída via Brevo usa porta 587, que já é liberada.

## DNS necessário por domínio

| Tipo | Nome | Valor | Obrigatório |
|---|---|---|---|
| A | `mail` | IP do servidor | sim |
| MX | `@` (raiz) | `10 mail.<dominio>` | sim |
| TXT | `@` (raiz) | `v=spf1 mx ~all` | sim |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:<endereco-de-relatorio>` | recomendado |
| TXT | `mail._domainkey` | gerado pelo próprio docker-mailserver (`setup config dkim domain <dominio>`) | sim |

No painel do registro.br, campos de domínio raiz (`@`) devem ficar **em branco** no campo "Nome" — o caractere `@` literal não é aceito.

Se for usar um relay externo pra ENVIO (Brevo, SendGrid etc), esse provedor pede registros próprios (código de verificação + DKIM dele) — ver seção "Relay de saída".

## Relay de saída (envio)

Como a Oracle bloqueia porta 25 de saída, o Postfix do docker-mailserver não entrega direto — ele relay tudo através de um provedor autenticado via porta 587. Configurado via variáveis de ambiente do próprio docker-mailserver:

```
DEFAULT_RELAY_HOST=[smtp-relay.brevo.com]:587
RELAY_USER=<login SMTP do provedor>
RELAY_PASSWORD=<senha/chave SMTP do provedor>
```

Credenciais reais ficam só no painel do Coolify (env vars do serviço), não neste documento.

**Autenticação de domínio no provedor de relay** (Brevo, no nosso caso): precisa autenticar o domínio remetente separadamente dentro do painel do Brevo (Senders & IP → Domains → Verify), que pede um código de verificação (TXT) + DKIM próprio deles (CNAME, geralmente 2 registros pra rotação de chave) — **diferente** do DKIM do nosso próprio mailserver. SPF não precisa mexer (Brevo usa envelope-sender próprio deles, não o nosso domínio).

Se o provedor de relay tiver **allowlist de IP** pra chamadas de API/SMTP (Brevo tem, ativada por padrão), o IP do servidor de e-mail precisa estar autorizado lá dentro, senão o Postfix recebe `535/525 Unauthorized` na hora de relayar.

## Criar/gerenciar contas e domínios

Tudo via `docker exec` no container do mailserver:

```bash
# nova caixa de e-mail
docker exec <container> setup email add usuario@dominio.com <senha>

# gerar chave DKIM pro domínio (uma vez por domínio)
docker exec <container> setup config dkim domain <dominio>
# a chave fica em /tmp/docker-mailserver/opendkim/keys/<dominio>/mail.txt

# listar contas
docker exec <container> setup email list
```

⚠️ O container **não sobe** (fica em restart-loop) se não existir nenhuma conta de e-mail cadastrada — ele espera 120s por uma conta na primeira inicialização e desliga se não achar. Pra domínio novo, criar a primeira conta rápido (dentro dessa janela) ou aceitar que vai reiniciar algumas vezes até você conseguir rodar o `setup email add` numa janela em que o container esteja `Up`.

## Encaminhamento (forward com cópia local)

**Não usar `.forward`** (mecanismo clássico do Postfix `local(8)`) — o docker-mailserver entrega via Dovecot LMTP, que ignora esse arquivo. O jeito certo é **Sieve**:

```bash
# dentro do container, ou via arquivo direto no volume:
cat > /var/mail/<dominio>/<usuario>/home/.dovecot.sieve <<'EOF'
require ["copy"];
redirect :copy "destino@outrodominio.com";
EOF

# compilar (opcional, o Dovecot compila sozinho no primeiro delivery, mas
# rodar manual detecta erro de sintaxe na hora):
docker exec <container> sievec /var/mail/<dominio>/<usuario>/home/.dovecot.sieve

# garantir dono correto (senão Dovecot recusa processar por segurança):
docker exec <container> chown docker:docker /var/mail/<dominio>/<usuario>/home/.dovecot.sieve
```

`redirect :copy` mantém a mensagem na caixa local **e** manda uma cópia pro destino. Sem o `:copy`, vira redirect puro (não guarda local).

Se o endereço que você quer encaminhar **não** tem caixa própria (é um alias puro), use `setup alias add <alias> <destino>` em vez de Sieve — mais simples, mas só funciona se o endereço não estiver cadastrado como conta.

## Certificado TLS real (Let's Encrypt via Traefik)

O servidor já roda Traefik (proxy do Coolify) pra HTTPS dos outros apps. Reaproveitamos ele em vez de rodar um Certbot separado — mais simples porque o Traefik já sabe emitir certificado via HTTP-01 (porta 80 já é dele).

1. No compose do mailserver, adiciona um router Traefik "fake" só pra forçar a emissão do certificado (o mailserver não serve HTTP de verdade, não tem problema):
   ```yaml
   labels:
     - traefik.enable=true
     - traefik.http.routers.mail-acme.rule=Host(`mail.<dominio>`)
     - traefik.http.routers.mail-acme.entrypoints=https
     - traefik.http.routers.mail-acme.tls.certresolver=letsencrypt
     - traefik.http.services.mail-acme.loadbalancer.server.port=80
   ```
2. Container `ldez/traefik-certs-dumper` observa o `acme.json` do Traefik (`/data/coolify/proxy/acme.json` no host) e extrai o certificado pro domínio em formato `certificate.crt` / `privatekey.key`.
3. docker-mailserver aponta pra esses arquivos:
   ```
   SSL_TYPE=manual
   SSL_CERT_PATH=/etc/dms-certs/<dominio-mail>/certificate.crt
   SSL_KEY_PATH=/etc/dms-certs/<dominio-mail>/privatekey.key
   ```

**Importante**: coloque o `certs-dumper` **no mesmo arquivo compose** do mailserver (mesmo serviço Coolify), não como serviço Coolify separado. O Coolify prefixa nomes de volume com o UUID do serviço — dois serviços diferentes acabam com volumes fisicamente diferentes mesmo declarando o mesmo nome ou usando `external: true` com `name:` customizado. Dentro do mesmo compose, o volume nomeado é compartilhado sem problema.

Até o certificado real ficar pronto (DNS precisa propagar primeiro), rode com `SSL_TYPE=self-signed` gerando um certificado temporário via `openssl req -x509 -newkey rsa:2048 ...` direto no volume de config, só pra não travar o boot.

## Cliente de e-mail (Thunderbird, Outlook, celular)

- **IMAP**: `mail.<dominio>`, porta `993`, SSL/TLS, autenticação "Normal password"
- **SMTP**: `mail.<dominio>`, porta `587`, STARTTLS, mesmo usuário/senha da caixa
- O envio sai automaticamente pelo relay configurado no servidor — não precisa nada extra no cliente.

## Pegadinhas / lições aprendidas

- **Arquitetura ARM**: confira `uname -m` do servidor antes de escolher a imagem. `docker manifest inspect <imagem>` mostra as arquiteturas publicadas.
- **Duas camadas de firewall na Oracle**: iptables local E Security List. Esquecer uma trava tudo silenciosamente ("connection timed out" de fora, mas o `ss -tlnp` mostra a porta escutando local — sinal de que é bloqueio de rede, não do processo).
- **Porta 25 de saída bloqueada pela Oracle**: sem solução rápida, use relay via 587.
- **SMTP Credentials da Oracle (Email Delivery) somem** em contas com Identity Domain federado/SSO — se não aparecer em "Tokens and keys" nem "My resources", provavelmente é isso; mais rápido trocar de provedor de relay (Brevo, SMTP2GO) do que brigar com a conta.
- **Brevo rejeita remetente não autenticado**: usar o e-mail de login SMTP (`xxxx@smtp-brevo.com`) como `sender` na API/relay não funciona — precisa ser um endereço do domínio autenticado.
- **DMARC**: só pode existir **um** registro TXT `_dmarc` por domínio. Se o provedor de relay pedir um DMARC próprio, mesclar o `rua=` com vírgula em vez de criar um segundo registro.
- **`.forward` não funciona** no docker-mailserver — é Sieve (`.dovecot.sieve`), ver seção acima.
- **`setup alias add` falha** se o endereço já existe como mailbox — nesse caso, forward via Sieve (mantém caixa local) em vez de alias puro.
- **Volumes nomeados não cruzam serviços Coolify** mesmo com `external: true` — Coolify sempre prefixa com o UUID do serviço atual. Serviços que precisam compartilhar dado devem estar no mesmo compose.
- **`docker exec ... setup email add` na janela de boot**: o container reinicia sozinho a cada 120s até existir 1 conta — é normal, não é bug.

## Adicionando um domínio novo neste mesmo servidor

1. DNS do novo domínio (tabela acima)
2. `docker exec <container> setup config dkim domain <novodominio>` → pega o TXT gerado, adiciona no DNS
3. `docker exec <container> setup email add <usuario>@<novodominio> <senha>`
4. Se for só forward: Sieve (`redirect :copy`) na pasta `home` da caixa
5. Se quiser enviar como esse domínio: autenticar no provedor de relay (Brevo → Senders & IP → Domains → Verify) e ajustar DMARC se precisar
6. TLS: se o hostname do mail for outro (não `mail.<dominio-principal>`), repetir o passo do Traefik router + certs-dumper pra esse novo hostname também
