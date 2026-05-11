import { redirect } from "next/navigation";
import type { AuthUser } from "@/lib/auth/session";
import type { Barbershop } from "@/types";

export function requireCompletedOnboarding(user: AuthUser, shop: Barbershop | null) {
  if (user.role === "barbearia_admin" && !shop?.onboardingCompleted) {
    redirect("/onboarding");
  }
}
