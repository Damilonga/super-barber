import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import type { UserRole } from "@/types";

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(role: UserRole) {
  const user = await requireUser();

  if (user.role !== role) {
    redirect(user.role === "super_admin" ? "/admin/barbearias" : "/barbearia/dashboard");
  }

  return user;
}
