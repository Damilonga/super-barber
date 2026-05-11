# Configuracao do Neon

Este projeto usa Neon como banco PostgreSQL.

## 1. Obter a connection string

No painel do Neon:

1. Abra o projeto que sera usado para o Super Barber.
2. Clique em **Connect**.
3. Escolha a branch, database e role.
4. Copie a connection string.

Use de preferencia a connection string pooled se o app for rodar em ambiente serverless.

Exemplo:

```env
DATABASE_URL="postgresql://usuario:senha@host.neon.tech/database?sslmode=require"
AUTH_SECRET="troque-por-uma-string-grande-e-segura"
```

## 2. Criar o arquivo local

Na raiz do app `super-barber`, crie um arquivo `.env.local` com:

```env
DATABASE_URL="cole-aqui-sua-url-do-neon"
AUTH_SECRET="uma-chave-grande-para-sessoes"
```

Para gerar uma chave segura:

```bash
npm run auth:secret
```

## 3. Rodar o schema

Depois de criar `.env.local`, rode no terminal:

```bash
npm run db:check
npm run db:schema
npm run db:seed
```

Se preferir, tambem pode copiar e executar manualmente no SQL Editor do Neon:

```text
database/schema.sql
database/seed.sql
```

## 4. Proxima etapa

Depois que o `.env.local` estiver configurado e o schema tiver sido executado no Neon, o proximo passo e trocar os dados mockados por consultas reais ao banco.
