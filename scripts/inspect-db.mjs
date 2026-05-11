import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL nao configurada.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const [barbershops] = await sql`select count(*)::int as count from public.barbershops`;
const [barbers] = await sql`select count(*)::int as count from public.barbers`;
const [services] = await sql`select count(*)::int as count from public.services`;
const [appointments] = await sql`select count(*)::int as count from public.appointments`;
const [users] = await sql`select count(*)::int as count from public.users`;
const [sessions] = await sql`select count(*)::int as count from public.sessions`;

console.log(
  JSON.stringify(
    { barbershops, barbers, services, appointments, users, sessions },
    null,
    2,
  ),
);
