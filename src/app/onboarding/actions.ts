"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/guards";
import { getSql } from "@/lib/db/client";
import { onboardingSchema } from "@/lib/validators/schemas";

export type OnboardingState = {
  ok: boolean;
  message: string;
};

export async function completeOnboarding(
  _previousState: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const user = await requireUser();
  const parsed = onboardingSchema.safeParse({
    barbershopId: formData.get("barbershopId"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    publicIntro: formData.get("publicIntro"),
    primaryColor: formData.get("primaryColor"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revise os dados informados.",
    };
  }

  if (
    user.role === "barbearia_admin" &&
    user.barbershopId !== parsed.data.barbershopId
  ) {
    return {
      ok: false,
      message: "Voce nao tem permissao para configurar essa barbearia.",
    };
  }

  const sql = getSql();

  await sql`
    update public.barbershops
    set name = ${parsed.data.name},
        phone = ${parsed.data.phone},
        address = ${parsed.data.address},
        public_intro = ${parsed.data.publicIntro},
        primary_color = ${parsed.data.primaryColor},
        onboarding_completed = true,
        updated_at = now()
    where id = ${parsed.data.barbershopId}
  `;

  redirect("/barbearia/dashboard");
}
