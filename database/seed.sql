insert into public.barbershops (
  id,
  name,
  slug,
  owner_name,
  email,
  phone,
  address,
  primary_color,
  public_intro,
  plan,
  status,
  onboarding_completed
) values (
  '11111111-1111-1111-1111-111111111111',
  'Barbearia Prime Studio',
  'barbearia-do-joao',
  'Joao Martins',
  'joao@barbearia.com',
  '(11) 99999-1000',
  'Rua Augusta, 1480 - Sao Paulo',
  '#2563eb',
  'Cortes modernos, barba alinhada e atendimento pontual no coracao da cidade.',
  'Pro',
  'ativa',
  true
) on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  owner_name = excluded.owner_name,
  email = excluded.email,
  phone = excluded.phone,
  address = excluded.address,
  primary_color = excluded.primary_color,
  public_intro = excluded.public_intro,
  plan = excluded.plan,
  status = excluded.status,
  onboarding_completed = excluded.onboarding_completed;

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
    'Joao Martins',
    '(11) 98888-1000',
    array['Corte classico', 'Barba premium', 'Tesoura'],
    'ativo'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Pedro Santos',
    '(11) 98888-2000',
    array['Degrade', 'Navalhado', 'Sobrancelha'],
    'ativo'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Lucas Andrade',
    '(11) 98888-3000',
    array['Corte infantil', 'Pigmentacao', 'Barboterapia'],
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
    'Corte masculino',
    'Corte completo com acabamento na navalha',
    70,
    40,
    'ativo'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Barba premium',
    'Toalha quente, modelagem e hidratacao',
    55,
    30,
    'ativo'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'Corte + barba',
    'Combo completo com acabamento premium',
    115,
    70,
    'ativo'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    'Barboterapia',
    'Limpeza, esfoliacao e relaxamento com toalha quente',
    80,
    45,
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
    '2026-05-11',
    '09:00',
    '09:40',
    'confirmado',
    70
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    '66666666-6666-6666-6666-666666666666',
    'Rafael Costa',
    '(11) 97777-2000',
    'rafael@email.com',
    '2026-05-11',
    '10:00',
    '11:10',
    'agendado',
    115
  ),
  (
    '99999999-9999-9999-9999-999999999999',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '55555555-5555-5555-5555-555555555555',
    'Andre Lima',
    '(11) 97777-3000',
    'andre@email.com',
    '2026-05-12',
    '14:00',
    '14:30',
    'confirmado',
    55
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

insert into public.available_hours (
  id,
  barbershop_id,
  barber_id,
  weekday,
  start_time,
  end_time,
  interval_minutes,
  active
) values
  ('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 1, '09:00', '18:00', 30, true),
  ('c2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 2, '09:00', '18:00', 30, true),
  ('c3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 3, '10:00', '19:00', 30, true),
  ('c4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 1, '10:00', '19:00', 30, true),
  ('c5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 2, '10:00', '19:00', 30, true),
  ('c6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '08:30', '17:30', 30, true),
  ('c7777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, '08:30', '17:30', 30, true),
  ('c8888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, '09:00', '18:00', 30, true)
on conflict (id) do update set
  weekday = excluded.weekday,
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  interval_minutes = excluded.interval_minutes,
  active = excluded.active;
