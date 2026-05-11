# Super Barber

SaaS para gestao de barbearias com painel de Super Admin, painel da barbearia e link publico de agendamento.

## Rodar localmente

Instale dependencias:

```bash
npm install
```

Configure `.env.local`:

```env
DATABASE_URL="sua-url-do-neon"
AUTH_SECRET="sua-chave-secreta"
```

Rode o app:

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

## Scripts principais

```bash
npm run lint
npm run build
npm run db:check
npm run db:schema
npm run db:seed
npm run db:inspect
npm run auth:secret
```

## Estrutura importante

```text
database/
  schema.sql
  seed.sql
  README_NEON.md
docs/
  MEMORIA_DO_PROJETO.md
  PROXIMOS_PASSOS.md
src/app/admin/
src/app/barbearia/
src/app/agendar/[slug]/
src/lib/db/
src/lib/validators/
```

## Estado atual

Ja existe um fluxo ponta a ponta:

1. Super Admin cadastra barbearia.
2. Barbearia cadastra barbeiros.
3. Barbearia cadastra servicos.
4. Cliente agenda no link publico.
5. Agendamento aparece na agenda da barbearia.

Mais detalhes em:

- `docs/MEMORIA_DO_PROJETO.md`
- `docs/PROXIMOS_PASSOS.md`
