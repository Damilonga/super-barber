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

- Mostrar apenas horarios realmente disponiveis.
- Bloquear horarios ja ocupados visualmente.
- Gerar horarios com base na agenda do barbeiro.
- Exibir tela de sucesso mais clara.
- Limpar formulario apos agendamento.

## 4. CRUD completo

Objetivo: permitir editar e excluir dados.

Tarefas:

- Editar barbearia.
- Ativar/inativar barbearia.
- Editar barbeiro.
- Ativar/inativar barbeiro.
- Editar servico.
- Ativar/inativar servico.
- Alterar status do agendamento.

## 5. Deploy

Objetivo: publicar primeira versao online.

Tarefas:

- Subir repositorio para GitHub.
- Criar projeto na Vercel.
- Configurar variaveis de ambiente.
- Conectar Neon.
- Testar deploy.

## 6. Comercial

Objetivo: deixar demonstravel e vendavel.

Tarefas:

- Criar dados demo melhores.
- Melhorar pagina publica da barbearia.
- Criar tela de planos.
- Criar pitch simples do produto.
- Criar checklist de apresentacao para barbearias.
