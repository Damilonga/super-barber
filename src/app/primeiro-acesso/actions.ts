"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/guards";
import { hashPassword } from "@/lib/auth/password";
import { getSql } from "@/lib/db/client";
import { firstAccessPasswordSchema } from "@/lib/validators/schemas";

export type FirstAccessState = {
  ok: boolean;
  message: string;
};

export async function updateFirstAccessPassword(
  _previousState: FirstAccessState,
  formData: FormData,
): Promise<FirstAccessState> {
  const user = await requireUser();
  const parsed = firstAccessPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revise a senha informada.",
    };
  }

  const sql = getSql();

  await sql`
    update public.users
    set password_hash = ${hashPassword(parsed.data.password)},
        first_access = false,
        updated_at = now()
    where id = ${user.id}
  `;

  redirect(user.role === "super_admin" ? "/admin/barbearias" : "/onboarding");
}
