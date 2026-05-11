import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getSql } from "@/lib/db/client";
import type { UserRole } from "@/types";

export const SESSION_COOKIE = "super_barber_session";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  barbershopId: string | null;
  firstAccess: boolean;
};

type UserSessionRow = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  barbershop_id: string | null;
  first_access: boolean;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function mapAuthUser(row: UserSessionRow): AuthUser {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    barbershopId: row.barbershop_id,
    firstAccess: row.first_access,
  };
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const sql = getSql();

  await sql`
    insert into public.sessions (user_id, token_hash, expires_at)
    values (${userId}, ${tokenHash}, ${expiresAt.toISOString()})
  `;

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const sql = getSql();
  const tokenHash = hashToken(token);
  const rows = (await sql`
    select
      users.id,
      users.full_name,
      users.email,
      users.role,
      users.barbershop_id,
      users.first_access
    from public.sessions
    inner join public.users on users.id = sessions.user_id
    where sessions.token_hash = ${tokenHash}
      and sessions.expires_at > now()
      and users.status = 'ativo'
    limit 1
  `) as UserSessionRow[];

  return rows[0] ? mapAuthUser(rows[0]) : null;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const sql = getSql();
    await sql`
      delete from public.sessions
      where token_hash = ${hashToken(token)}
    `;
  }

  cookieStore.delete(SESSION_COOKIE);
}
