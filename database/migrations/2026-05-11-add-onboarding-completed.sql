alter table public.barbershops
  add column if not exists onboarding_completed boolean not null default false;

update public.barbershops
set onboarding_completed = true
where id = '11111111-1111-1111-1111-111111111111';
