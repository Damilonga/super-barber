"use server";

import { redirect } from "next/navigation";
import { getSql } from "@/lib/db/client";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import type { UserRole } from "@/types";

export type LoginState = {
  ok: boolean;
  message: string;
};

type LoginUserRow = {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  first_access: boolean;
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      ok: false,
      message: "Informe e-mail e senha.",
    };
  }

  const sql = getSql();
  const rows = (await sql`
    select id, email, password_hash, role, first_access
    from public.users
    where email = ${email}
      and status = 'ativo'
    limit 1
  `) as LoginUserRow[];

  const user = rows[0];

  if (!user || !verifyPassword(password, user.password_hash)) {
    return {
      ok: false,
      message: "E-mail ou senha invalidos.",
    };
  }

  await createSession(user.id);

  if (user.first_access) {
    redirect("/primeiro-acesso");
  }

  redirect(user.role === "super_admin" ? "/admin/barbearias" : "/barbearia/dashboard");
}
