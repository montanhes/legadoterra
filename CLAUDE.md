# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é

Legado Terra — plataforma de doação de sangue para pets (cães e gatos). Tutores cadastram pets como potenciais doadores, clínicas confirmam tipagem sanguínea via código, e quem precisa de sangue busca doadores compatíveis por proximidade geográfica.

Monorepo: API Laravel em `backend/` + SPA React em `frontend/`. Sem comunicação direta entre os dois em build-time — só HTTP.

## Comandos

### Backend (`backend/`)

```bash
./vendor/bin/sail up -d              # sobe app + MariaDB + Redis
./vendor/bin/sail artisan migrate
./vendor/bin/sail pest                       # roda toda a suíte
./vendor/bin/sail pest tests/Feature/Xyz.php # um arquivo
./vendor/bin/sail pest --filter=nome_do_teste
./vendor/bin/sail artisan pint               # formata (Laravel Pint)
```

API sobe em `http://localhost`. Sem Sail (PHP/MariaDB local já configurados): trocar `./vendor/bin/sail` por `php artisan` / `./vendor/bin/pest`.

Cobertura de teste hoje é mínima (só `ExampleTest` em Unit/Feature) — não assumir que existe suíte cobrindo alguma feature antes de checar.

### Frontend (`frontend/`)

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # tsc -b && vite build
npm run lint      # oxlint
```

CORS e `SANCTUM_STATEFUL_DOMAINS` no backend estão fixados em `localhost:5173`; se a porta estiver ocupada, ajustar `FRONTEND_URL`/`SANCTUM_STATEFUL_DOMAINS` em `backend/.env`.

## Arquitetura

### Autenticação

Sanctum SPA (cookie-based, não token bearer). Frontend chama `GET /sanctum/csrf-cookie` (`ensureCsrfCookie()` em `frontend/src/lib/api.ts`) antes de login/registro. Axios configurado com `withCredentials` + `withXSRFToken`. Login com Google via `routes/web.php` (`GoogleAuthController`, fora do prefixo `/api`, é redirect flow tradicional).

Dois "papéis" sem tabela de roles separada: usuário comum (tutor de pet) e clínica. Clínica é uma tabela própria (`Clinic`) com `hasOne` em `User`; `User::isVerifiedClinic()` checa `clinic.verified`. No frontend, `ProtectedRoute` vs `ClinicRoute` (`frontend/src/App.tsx`) fazem esse split.

### Fluxo de doação

1. Tutor cadastra `Pet` e opcionalmente cria `DonorProfile` (1:1) pra ele virar doador.
2. `DonorProfile.typing_status` começa `Autoinformado`/`NaoTestado`. Elegibilidade (`EligibilityStatus`) é calculada por `App\Actions\DetermineDonorEligibility`: **gatos só ficam `Apto` com tipagem `ConfirmadoClinica`** (sistema AB felino tem risco de reação já na primeira transfusão incompatível); cães ficam aptos mesmo sem tipagem confirmada.
3. Tipagem confirmada é sempre via clínica: tutor gera código (`PetTypingCodeController`), clínica confirma com o código (`TypingConfirmationController`) — atualiza `DonorProfile` e marca o código como usado, tudo dentro de uma `DB::transaction`.
4. Quem precisa de sangue abre `DonationRequest` (`Aberta`/`Atendida`/`Expirada`); busca doadores via `DonorSearchController`.

Ao mexer em qualquer um desses passos, checar os `Enums` correspondentes (`app/Enums/`) — todos são int-backed com `label()` PT-BR, e a UI depende desses valores numéricos no contrato da API (ver `frontend/src/types/api.ts`).

### Geolocalização

- Coordenadas reais (`lat`/`lng`) ficam em colunas decimal; um trigger de model (`App\Concerns\HasPointLocation`, usado em `Pet`) sincroniza uma coluna `location` (`POINT` MySQL/MariaDB) sempre que `lat`/`lng` mudam — é essa coluna que tem o spatial index.
- Busca por raio (`Pet::scopeNearby`) usa bounding box (`MBRContains`) pra acionar o índice espacial e refina com `ST_Distance_Sphere` — não trocar por um filtro Eloquent ingênuo, foi desenhado assim de propósito (validado via `EXPLAIN`).
- Coordenadas **exibidas publicamente** em resultado de busca são deslocadas aleatoriamente 50-400m (`App\Concerns\JittersCoordinates`) pra não expor o endereço exato do tutor. O raio de busca em si usa a coordenada real — só a exibição é jitterizada. Não remover isso nem "corrigir" a imprecisão sem entender que é proteção de privacidade intencional.

Isso exige MariaDB/MySQL com suporte espacial — não portar pra SQLite/Postgres sem revisar essas duas partes.

### Backend — convenções observadas

- Laravel 13 / PHP 8.4, Pest 4 para testes.
- Controllers finos: validação em `Http/Requests/*` (por domínio: `Pet/`, `Clinic/`, `DonationRequest/`, etc.), regra de negócio não-trivial em `App\Actions\*`, serialização em `Http/Resources/*`.
- Autorização via `Policies` (`DonationRequestPolicy`, `PetPolicy`), não checagem manual dentro do controller.
- Modelos usam tanto o estilo clássico (`protected $fillable`, em `Pet`) quanto atributos PHP 8 (`#[Fillable]`, `#[Hidden]`, em `User`) — checar o arquivo antes de assumir qual convenção usar num modelo novo.
- Pivot `donor_profile_donation_type` é acessado via query builder cru (`DB::table`), não `belongsToMany`, porque `DonorProfile::donationTypes()`/`syncDonationTypes()` precisa mapear pro enum `DonationType` manualmente.

### Frontend — convenções observadas

- React 19 + TypeScript + Vite, Tailwind v4, React Router v7 (`react-router`, não `react-router-dom`), TanStack Query pra todo estado de servidor, React Hook Form + Zod pra formulários.
- Hooks de dados em `src/hooks/` (um por domínio: `useAuth`, `usePets`, `useDonorSearch`, `useDonationRequests`, `useClinic`, `useTypingCode`), sempre envolvendo `api` (`src/lib/api.ts`) com TanStack Query.
- Rotas protegidas via elemento wrapper (`ProtectedRoute`, `ClinicRoute`) na árvore do `Routes`, não HOC.
- Linter é `oxlint` (`npm run lint`), não ESLint.
