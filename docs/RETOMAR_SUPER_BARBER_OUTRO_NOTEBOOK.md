# Retomar Super Barber Em Outro Notebook

Use este arquivo quando for continuar o projeto em outro computador.

## Repositorio

```text
https://github.com/Damilonga/super-barber
```

Comandos iniciais:

```powershell
git clone https://github.com/Damilonga/super-barber.git
cd super-barber
npm install
```

Se o projeto ja existir no notebook:

```powershell
git pull
npm install
```

## Arquivos para o Codex ler ao retomar

Peca ao Codex:

```text
Leia AGENTS.md, .codex/config.toml, docs/MEMORIA_DO_PROJETO.md, docs/PROXIMOS_PASSOS.md e docs/RETOMAR_SUPER_BARBER_OUTRO_NOTEBOOK.md.
Nao edite nada ainda. Apenas diagnostique onde paramos.
```

## Variaveis locais

O arquivo `.env.local` nao vai para o GitHub por seguranca.

No outro notebook, criar manualmente:

```text
.env.local
```

Com:

```env
DATABASE_URL=cole_a_url_do_neon_aqui
AUTH_SECRET=cole_o_secret_aqui
```

Nunca commitar `.env.local`, chaves, tokens ou credenciais.

## Producao

URL principal:

```text
https://super-barber-rho.vercel.app
```

Rotas uteis:

```text
https://super-barber-rho.vercel.app
https://super-barber-rho.vercel.app/login
https://super-barber-rho.vercel.app/planos
https://super-barber-rho.vercel.app/agendar/barbearia-do-joao
```

Projeto Vercel:

```text
damilongas-projects/super-barber
```

Variaveis na Vercel:

```text
DATABASE_URL
AUTH_SECRET
```

Nao exibir os valores dessas variaveis.

## Estado atual

O app ja possui:

- painel Super Admin;
- cadastro de barbearias;
- usuario da barbearia com primeiro acesso;
- onboarding;
- painel da barbearia;
- cadastro, edicao e inativacao de barbeiros;
- cadastro, edicao e inativacao de servicos;
- agenda com status;
- link publico de agendamento;
- pagina publica de planos;
- materiais comerciais em `docs`.

## Ultimas correcoes

- IDs internos usam `postgresUuidSchema` para aceitar UUIDs validos no Postgres.
- Cadastro de servicos nao deve mais mostrar `Barbearia invalida` indevidamente.
- Modal de edicao de servico fecha automaticamente apos salvar com sucesso.
- Ultimas correcoes foram commitadas, enviadas ao GitHub e publicadas na Vercel.

## Proximas demandas priorizadas

1. Padronizar valores em moeda brasileira.
2. Bloquear horarios passados e reforcar regras basicas de agenda.
3. Permitir configuracao de agenda por barbearia.
4. Criar vinculo entre barbeiros e servicos.
5. Permitir multiplos servicos em um mesmo agendamento.
6. Completar cadastro da barbearia com CPF/CNPJ e dados comerciais.
7. Melhorar dashboard gerencial com filtros e indicadores.
8. Planejar confirmacoes por e-mail e WhatsApp.

Proximo passo recomendado: comecar pela padronizacao de moeda.

## Regras de trabalho

- Seguir `AGENTS.md`.
- Usar minimo de contexto necessario.
- Investigar antes de alterar.
- Listar arquivos antes de editar.
- Pedir confirmacao para arquitetura, banco, autenticacao, permissoes, dependencias e deploy.
- Nao alterar `.env`, `.env.local`, chaves, tokens ou credenciais.
- Usar prompts em `.codex/prompts/` quando a tarefa se encaixar.
