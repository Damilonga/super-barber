# Git Sync Seguro

Use este prompt quando o usuario pedir para sincronizar o projeto com GitHub, preparar inicio de trabalho com `git pull`, ou finalizar etapa com commit/push.

## Objetivo

Manter o projeto sincronizado entre notebooks sem perder trabalho local e sem commitar arquivos sensiveis.

## Regras

- Nao executar comandos destrutivos.
- Nao usar `git reset --hard`.
- Nao usar `git checkout --` para descartar alteracoes.
- Nao usar `git add .` automaticamente.
- Nao commitar `.env`, `.env.local`, chaves, tokens ou credenciais.
- Antes de `git pull`, verificar `git status --short`.
- Se houver alteracoes locais, avisar o usuario e recomendar commit/stash manual antes do pull.
- Antes de commit, listar arquivos alterados.
- Adicionar explicitamente apenas arquivos relacionados ao escopo.
- Sugerir mensagem de commit objetiva.
- Pedir confirmacao antes de commit/push se houver arquivo inesperado, sensivel ou fora do escopo.

## Inicio de trabalho

1. Rodar:

```powershell
git status --short
git branch --show-current
git remote -v
```

2. Se o status estiver limpo, rodar:

```powershell
git pull
```

3. Se houver alteracoes locais, nao rodar `git pull` ainda. Responder com:

- arquivos alterados;
- risco de conflito;
- recomendacao: commit das alteracoes, stash manual ou revisar antes.

## Final de etapa

1. Rodar:

```powershell
git status --short
git diff --stat
```

2. Verificar se ha arquivos sensiveis:

```powershell
git status --short | Select-String -Pattern "\.env|secret|token|key|credential"
```

3. Se estiver seguro, listar arquivos que serao adicionados.

4. Rodar `git add` com caminhos explicitos.

5. Rodar:

```powershell
git commit -m "mensagem objetiva"
git push
```

6. Confirmar branch, commit e push.

## Formato de resposta antes de agir

Responder com:

1. Estado atual do Git
2. Arquivos alterados
3. Acao recomendada
4. Comandos que pretende executar
5. Confirmacao necessaria, se houver

## Formato de resposta depois de concluir

Responder com:

1. Pull/commit/push realizado
2. Branch
3. Commit criado, se houver
4. Arquivos incluidos
5. Pendencias, se houver
