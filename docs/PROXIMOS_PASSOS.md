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
- [ ] Refinar menu por perfil.
- [ ] Remover credenciais demo da tela de login antes de producao.
- [ ] Trocar senha do Neon antes de producao.
- [ ] Reforcar isolamento por `barbershop_id` em todos os fluxos.

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
