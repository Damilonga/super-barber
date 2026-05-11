import { randomBytes, scryptSync } from "node:crypto";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL nao configurada.");
  process.exit(1);
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `scrypt:${salt}:${hash}`;
}

const sql = neon(process.env.DATABASE_URL);

await sql`
  insert into public.users (
    full_name,
    email,
    password_hash,
    role,
    barbershop_id,
    first_access,
    status
  ) values (
    'Super Admin',
    'admin@superbarber.local',
    ${hashPassword("SuperBarber123!")},
    'super_admin',
    null,
    false,
    'ativo'
  )
  on conflict (email) do update set
    password_hash = excluded.password_hash,
    role = excluded.role,
    first_access = excluded.first_access,
    status = excluded.status
`;

await sql`
  insert into public.users (
    full_name,
    email,
    password_hash,
    role,
    barbershop_id,
    first_access,
    status
  ) values (
    'Joao Martins',
    'joao@barbearia.local',
    ${hashPassword("Barbearia123!")},
    'barbearia_admin',
    '11111111-1111-1111-1111-111111111111',
    false,
    'ativo'
  )
  on conflict (email) do update set
    password_hash = excluded.password_hash,
    role = excluded.role,
    barbershop_id = excluded.barbershop_id,
    first_access = excluded.first_access,
    status = excluded.status
`;

console.log("Usuarios iniciais criados/atualizados.");
console.log("Super Admin: admin@superbarber.local / SuperBarber123!");
console.log("Barbearia: joao@barbearia.local / Barbearia123!");
