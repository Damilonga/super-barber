# Memoria do Projeto - Super Barber

Atualizado em: 2026-05-11

## Visao geral

O Super Barber e um SaaS para gestao de barbearias. A plataforma tera um painel de Super Admin para cadastrar barbearias clientes e um painel individual para cada barbearia gerenciar barbeiros, servicos, agenda, configuracoes e link publico de agendamento.

## Pasta principal

```text
C:\Users\dario\Documents\MEGA\CODEX NOVO PROJETO\super-barber
```

## Stack atual

- Next.js com App Router
- TypeScript
- Tailwind CSS
- Neon PostgreSQL
- Server Actions
- Zod para validacao
- Lucide React para icones
- Vercel para deploy

## Deploy

Projeto Vercel: `damilongas-projects/super-barber`

URL de producao:

```text
https://super-barber-rho.vercel.app
```

Rotas testadas em producao:

- `/`
- `/login`
- `/agendar/barbearia-do-joao`

Variaveis configuradas na Vercel:

- `DATABASE_URL`
- `AUTH_SECRET`

## Banco de dados

Banco usado: Neon

Variaveis locais:

```env
DATABASE_URL="configurada em .env.local"
AUTH_SECRET="configurada em .env.local"
```

Importante: o arquivo `.env.local` nao deve ir para o GitHub.

Scripts uteis:

```bash
npm run db:check
npm run db:schema
npm run db:seed
npm run db:inspect
npm run auth:secret
```

## Tabelas atuais

- `users`
- `sessions`
- `profiles`
- `barbershops`
- `barbers`
- `services`
- `available_hours`
- `appointments`

## Dados demo atuais

Dados demo principais:

- Barbearia Prime Studio
- barbeiros ativos de demonstracao
- servicos ativos de demonstracao
- disponibilidade por barbeiro em `available_hours`
- agendamentos demo em datas proximas ao inicio do projeto

## Fluxos implementados

### Autenticacao

- Login real com e-mail e senha.
- Tela de login nao exibe mais credenciais demo.
- Senhas salvas com hash `scrypt`.
- Sessoes salvas na tabela `sessions`.
- Cookie HTTP-only chamado `super_barber_session`.
- Logout real destruindo a sessao.
- Rotas de Super Admin protegidas por perfil `super_admin`.
- Rotas da barbearia protegidas por usuario logado.
- Actions de cadastro protegidas no servidor.

Usuarios iniciais de desenvolvimento:

- Super Admin: `admin@superbarber.local` / `SuperBarber123!`
- Barbearia: `joao@barbearia.local` / `Barbearia123!`

Arquivos principais:

- `src/lib/auth/password.ts`
- `src/lib/auth/session.ts`
- `src/lib/auth/guards.ts`
- `src/lib/auth/actions.ts`
- `src/lib/auth/barbershop-context.ts`
- `src/app/login/page.tsx`
- `src/app/login/actions.ts`
- `src/app/login/login-form.tsx`
- `scripts/seed-auth-users.mjs`

### Super Admin

- Lista barbearias vindas do Neon.
- Cadastra nova barbearia no Neon.
- Edita dados da barbearia no Neon.
- Ativa/inativa barbearias sem apagar historico.
- Ao inativar/bloquear uma barbearia, inativa tambem o usuario admin dessa barbearia.
- Copia link publico de agendamento direto pela tabela.
- Gera slug automaticamente.
- Valida nome, responsavel, e-mail, telefone e plano.
- Ao cadastrar uma barbearia, cria tambem o usuario dono.
- Gera senha temporaria e exibe e-mail, senha e link de login para envio manual.
- Usuario dono nasce com `first_access = true`.

Arquivos principais:

- `src/app/admin/barbearias/page.tsx`
- `src/app/admin/barbearias/actions.ts`
- `src/app/admin/barbearias/create-barbershop-form.tsx`
- `src/app/admin/barbearias/barbershop-row-actions.tsx`

### Primeiro acesso

- Login detecta usuarios com `first_access = true`.
- Usuarios de primeiro acesso sao redirecionados para `/primeiro-acesso`.
- Tela de primeiro acesso criada com troca obrigatoria de senha.
- Nova senha e validada com minimo de 8 caracteres, letra maiuscula, letra minuscula e numero.
- Apos trocar a senha, `first_access` vira `false`.
- Usuario de barbearia e redirecionado para `/onboarding`.

Arquivos principais:

- `src/app/primeiro-acesso/page.tsx`
- `src/app/primeiro-acesso/actions.ts`
- `src/app/primeiro-acesso/first-access-form.tsx`

### Onboarding da barbearia

- Tabela `barbershops` possui `onboarding_completed`.
- Nova rota `/onboarding`.
- Dono configura nome publico, telefone, endereco, apresentacao e cor principal.
- Ao concluir, `onboarding_completed` vira `true`.
- Painel da barbearia redireciona para `/onboarding` enquanto a configuracao inicial nao for concluida.

Arquivos principais:

- `database/migrations/2026-05-11-add-onboarding-completed.sql`
- `src/app/onboarding/page.tsx`
- `src/app/onboarding/actions.ts`
- `src/app/onboarding/onboarding-form.tsx`
- `src/lib/auth/onboarding-guard.ts`

### Painel da barbearia

- Menu lateral agora usa dados reais do usuario logado e da barbearia.
- Menu de Super Admin foi separado do menu operacional da barbearia.
- Dashboard le dados reais do Neon.
- Agenda le agendamentos reais do Neon.
- Agenda permite alterar status do agendamento: agendado, confirmado, atendido, cancelado e ausente.
- Barbeiros leem e cadastram dados reais no Neon.
- Barbeiros podem ser editados e ativados/inativados sem apagar historico.
- Servicos leem e cadastram dados reais no Neon.
- Servicos podem ser editados e ativados/inativados sem apagar historico.
- Configuracoes carregam dados reais da barbearia padrao.

Arquivos principais:

- `src/app/barbearia/dashboard/page.tsx`
- `src/app/barbearia/agenda/page.tsx`
- `src/app/barbearia/agenda/actions.ts`
- `src/app/barbearia/agenda/appointment-status-select.tsx`
- `src/app/barbearia/barbeiros/page.tsx`
- `src/app/barbearia/barbeiros/actions.ts`
- `src/app/barbearia/barbeiros/create-barber-form.tsx`
- `src/app/barbearia/barbeiros/barber-row-actions.tsx`
- `src/app/barbearia/servicos/page.tsx`
- `src/app/barbearia/servicos/actions.ts`
- `src/app/barbearia/servicos/create-service-form.tsx`
- `src/app/barbearia/servicos/service-row-actions.tsx`
- `src/app/barbearia/configuracoes/page.tsx`

### Agendamento publico

- Pagina publica por slug em `/agendar/[slug]`.
- Pagina publica ganhou cabecalho comercial com identidade da barbearia, endereco, telefone, profissionais e servicos em destaque.
- Carrega barbearia, barbeiros e servicos do Neon.
- Cliente escolhe barbeiro, servico, data, horario disponivel e informa dados.
- Agendamento e salvo no Neon.
- Sistema calcula horario final usando duracao do servico.
- Sistema gera horarios com base em `available_hours` quando existir.
- Para barbeiros antigos sem disponibilidade cadastrada, usa fallback temporario de segunda a sabado, das 09:00 as 18:00.
- Sistema bloqueia visualmente horarios ocupados e tambem revalida no servidor antes de salvar.
- Sistema impede conflitos por sobreposicao de horario do mesmo barbeiro, nao apenas mesmo horario inicial.
- Servidor deriva a barbearia pelo `slug` da URL no agendamento publico e nao depende de `barbershop_id` enviado pelo navegador.
- Validação do agendamento publico aceita UUID no formato usado pelo Postgres para IDs demo e reais.
- Tela de sucesso do cliente ficou mais clara e os campos do formulario sao limpos apos confirmacao.
- Agenda da barbearia passa a mostrar o agendamento.

Arquivos principais:

- `src/app/agendar/[slug]/page.tsx`
- `src/app/agendar/[slug]/actions.ts`
- `src/app/agendar/[slug]/booking-form.tsx`

## Arquivos de banco

- `database/schema.sql`
- `database/seed.sql`
- `database/README_NEON.md`

## Utilitarios importantes

- `src/lib/db/client.ts`
- `src/lib/db/queries.ts`
- `src/lib/validators/schemas.ts`
- `src/lib/utils/slug.ts`

## Validacoes ja feitas

Comandos que passaram:

```bash
npm run lint
npm run build
npm run db:check
npm run db:inspect
```

## Proximo bloco recomendado

Refinar pre-producao: remover credenciais demo da tela de login, trocar senha do Neon, revisar isolamento por barbearia e preparar dominio proprio.

## Materiais comerciais

- Tela publica de planos em `/planos`.
- Pitch comercial em `docs/PITCH_COMERCIAL.md`.
- Checklist de demonstracao em `docs/CHECKLIST_DEMO_BARBEARIAS.md`.

## Rotina Git

- Prompt reutilizavel em `.codex/prompts/git-sync.md`.
- Checklist operacional em `docs/ROTINA_GIT.md`.
- Usar antes de iniciar trabalho em outro notebook e ao finalizar uma etapa com commit/push.

## Observacoes importantes

- Hoje as telas da barbearia usam a primeira barbearia cadastrada como contexto temporario.
- Isso deve mudar quando login/permissoes forem implementados.
- A senha do banco foi compartilhada durante o desenvolvimento. Antes de producao, trocar a senha no Neon e atualizar `.env.local`.
- O arquivo `.env.local` esta listado no `.gitignore` e nao deve ser commitado.
