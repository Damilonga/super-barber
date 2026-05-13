# Rotina Git Segura - Super Barber

Use esta rotina para trabalhar no Super Barber em mais de um notebook.

## Ao comecar a trabalhar

1. Entrar na pasta do projeto:

```powershell
cd "C:\Users\dario\Documents\MEGA\CODEX NOVO PROJETO\super-barber"
```

2. Verificar se ha alteracoes locais:

```powershell
git status --short
```

3. Se nao houver alteracoes, atualizar:

```powershell
git pull
```

4. Se houver alteracoes locais, nao fazer `pull` ainda. Primeiro decidir se vai:

- commitar;
- guardar fora;
- revisar;
- ou pedir ajuda ao Codex.

## Ao terminar uma etapa

1. Validar o projeto quando fizer sentido:

```powershell
npm run lint
npm run build
```

2. Ver o que mudou:

```powershell
git status --short
git diff --stat
```

3. Confirmar que nenhum arquivo sensivel entrou:

```powershell
git status --short | Select-String -Pattern "\.env|secret|token|key|credential"
```

4. Adicionar arquivos especificos, nao usar `git add .` sem revisar:

```powershell
git add caminho/do/arquivo
```

5. Criar commit:

```powershell
git commit -m "mensagem curta da etapa"
```

6. Enviar para GitHub:

```powershell
git push
```

## Nunca fazer sem cuidado

- Nao usar `git reset --hard`.
- Nao usar comandos para apagar alteracoes sem revisar.
- Nao commitar `.env`, `.env.local`, chaves, tokens ou credenciais.
- Nao dar `git pull` com alteracoes locais sem entender o risco.
- Nao usar `git add .` quando houver arquivos desconhecidos.

## Pedido rapido para o Codex

Para iniciar trabalho:

```text
Use o prompt git-sync e prepare o projeto para eu comecar a trabalhar. Nao edite arquivos.
```

Para finalizar trabalho:

```text
Use o prompt git-sync para revisar alteracoes, criar commit e fazer push com seguranca.
```

