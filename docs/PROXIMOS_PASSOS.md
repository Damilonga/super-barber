# Proximos Passos - Super Barber

## 1. Autenticacao e permissoes

Objetivo: deixar Super Admin e barbearia com acessos separados.

Tarefas:

- [x] Usar autenticacao propria com `users` e `sessions`.
- [x] Implementar login real.
- [x] Criar sessao segura com cookie HTTP-only.
- [x] Criar perfil `super_admin`.
- [x] Criar perfil `barbearia_admin`.
- [x] Redirecionar cada usuario para seu painel correto.
- [x] Proteger rotas do admin.
- [x] Proteger rotas da barbearia por usuario logado.
- [x] Proteger actions de cadastro no servidor.
- [x] Refinar menu por perfil.
- [x] Remover credenciais demo da tela de login antes de producao.
- [ ] Trocar senha do Neon antes de producao.
- [x] Reforcar isolamento por `barbershop_id` em todos os fluxos criticos.

## 2. Melhorar cadastro de barbearias

Objetivo: ao cadastrar barbearia, preparar acesso do dono.

Tarefas:

- [x] Criar usuario dono da barbearia.
- [x] Gerar senha temporaria.
- [x] Exibir credenciais para o Super Admin copiar.
- [x] Redirecionar usuario de primeiro acesso para `/primeiro-acesso`.
- [x] Forcar troca de senha no primeiro acesso.
- [x] Adicionar onboarding inicial.

## 3. Melhorar agendamento publico

Objetivo: deixar o agendamento mais proximo de producao.

Tarefas:

- [x] Mostrar apenas horarios realmente disponiveis.
- [x] Bloquear horarios ja ocupados visualmente.
- [x] Gerar horarios com base na agenda do barbeiro.
- [x] Exibir tela de sucesso mais clara.
- [x] Limpar formulario apos agendamento.
- [x] Revalidar disponibilidade no servidor antes de salvar.

## 4. CRUD completo

Objetivo: permitir editar e excluir dados.

Tarefas:

- [x] Editar barbearia.
- [x] Ativar/inativar barbearia.
- [x] Editar barbeiro.
- [x] Ativar/inativar barbeiro.
- [x] Editar servico.
- [x] Ativar/inativar servico.
- [x] Alterar status do agendamento.

## 5. Deploy

Objetivo: publicar primeira versao online.

Tarefas:

- [x] Subir repositorio para GitHub.
- [x] Criar projeto na Vercel.
- [x] Configurar variaveis de ambiente.
- [x] Conectar Neon.
- [x] Testar deploy.

## 6. Comercial

Objetivo: deixar demonstravel e vendavel.

Tarefas:

- [x] Criar dados demo melhores.
- [x] Melhorar pagina publica da barbearia.
- [x] Criar tela de planos.
- [x] Criar pitch simples do produto.
- [x] Criar checklist de apresentacao para barbearias.

## 7. Evolucao do produto

Objetivo: transformar o app em uma ferramenta mais completa para operacao e tomada de decisao da barbearia.

Demandas priorizadas:

- [ ] Padronizar valores em moeda brasileira em telas, cards, tabelas, agendamento e relatorios.
- [ ] Bloquear horarios passados no dia atual e reforcar regras de disponibilidade no agendamento.
- [ ] Permitir que a barbearia configure intervalo de agenda, dias de funcionamento, abertura, fechamento e limite de agenda futura.
- [ ] Criar vinculo entre barbeiros e servicos.
- [ ] Permitir multiplos servicos em um mesmo agendamento com soma de duracao.
- [ ] Completar cadastro da barbearia com CPF/CNPJ, razao social, nome fantasia, responsavel, WhatsApp e endereco completo.
- [ ] Melhorar dashboard gerencial com filtros e indicadores para tomada de decisao.
- [ ] Planejar confirmacoes por e-mail e WhatsApp, sem implementar antes de escolher o provedor.

Ordem recomendada:

1. Moeda.
2. Horarios passados e regras basicas de agenda.
3. Configuracao de agenda.
4. Vinculo barbeiro-servico.
5. Multiplos servicos.
6. Cadastro completo da barbearia.
7. Dashboard gerencial.
8. E-mail e WhatsApp.
