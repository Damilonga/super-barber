import type { AuthUser } from "@/lib/auth/session";
import { getBarbershopById, getDefaultBarbershop } from "@/lib/db/queries";

export async function getBarbershopForUser(user: AuthUser) {
  if (user.role === "barbearia_admin" && user.barbershopId) {
    return getBarbershopById(user.barbershopId);
  }

  return getDefaultBarbershop();
}
