insert into public.barbershops (
  id,
  name,
  slug,
  owner_name,
  email,
  phone,
  address,
  public_intro,
  plan,
  status
) values (
  '11111111-1111-1111-1111-111111111111',
  'Barbearia do Joao',
  'barbearia-do-joao',
  'Joao Martins',
  'joao@barbearia.com',
  '(11) 99999-1000',
  'Rua Exemplo, 123',
  'Agende seu corte com rapidez e escolha seu barbeiro favorito.',
  'Pro',
  'ativa'
) on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  owner_name = excluded.owner_name,
  email = excluded.email,
  phone = excluded.phone,
  address = excluded.address,
  public_intro = excluded.public_intro,
  plan = excluded.plan,
  status = excluded.status;

insert into public.barbers (
  id,
  barbershop_id,
  name,
  phone,
  specialties,
  status
) values
  (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Joao',
    '(11) 98888-1000',
    array['Corte masculino', 'Barba'],
    'ativo'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Pedro',
    '(11) 98888-2000',
    array['Degrade', 'Sobrancelha'],
    'ativo'
  )
on conflict (id) do update set
  name = excluded.name,
  phone = excluded.phone,
  specialties = excluded.specialties,
  status = excluded.status;

insert into public.services (
  id,
  barbershop_id,
  name,
  description,
  price,
  duration_minutes,
  status
) values
  (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'Corte',
    'Corte masculino completo',
    60,
    30,
    'ativo'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Barba',
    'Modelagem de barba',
    45,
    30,
    'ativo'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'Corte + barba',
    'Combo completo de corte e barba',
    95,
    60,
    'ativo'
  )
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  duration_minutes = excluded.duration_minutes,
  status = excluded.status;

insert into public.appointments (
  id,
  barbershop_id,
  barber_id,
  service_id,
  customer_name,
  customer_phone,
  customer_email,
  appointment_date,
  start_time,
  end_time,
  status,
  value
) values
  (
    '77777777-7777-7777-7777-777777777777',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '44444444-4444-4444-4444-444444444444',
    'Carlos Silva',
    '(11) 97777-1000',
    'carlos@email.com',
    '2026-05-08',
    '09:00',
    '09:30',
    'confirmado',
    60
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    '66666666-6666-6666-6666-666666666666',
    'Rafael Costa',
    '(11) 97777-2000',
    'rafael@email.com',
    '2026-05-08',
    '10:00',
    '11:00',
    'agendado',
    95
  ),
  (
    '99999999-9999-9999-9999-999999999999',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '55555555-5555-5555-5555-555555555555',
    'Andre Lima',
    '(11) 97777-3000',
    'andre@email.com',
    '2026-05-08',
    '14:00',
    '14:30',
    'atendido',
    45
  )
on conflict (id) do update set
  barber_id = excluded.barber_id,
  service_id = excluded.service_id,
  customer_name = excluded.customer_name,
  customer_phone = excluded.customer_phone,
  customer_email = excluded.customer_email,
  appointment_date = excluded.appointment_date,
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  status = excluded.status,
  value = excluded.value;
