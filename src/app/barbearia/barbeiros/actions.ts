"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/guards";
import { getSql } from "@/lib/db/client";
import { barberSchema } from "@/lib/validators/schemas";

export type CreateBarberState = {
  ok: boolean;
  message: string;
};

export async function createBarber(
  _previousState: CreateBarberState,
  formData: FormData,
): Promise<CreateBarberState> {
  const user = await requireUser();
  const parsed = barberSchema.safeParse({
    barbershopId: formData.get("barbershopId"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    specialties: formData.get("specialties"),
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
      message: "Voce nao tem permissao para cadastrar nessa barbearia.",
    };
  }

  const specialties = (parsed.data.specialties ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  try {
    const sql = getSql();

    await sql`
      insert into public.barbers (
        barbershop_id,
        name,
        phone,
        specialties,
        status
      ) values (
        ${parsed.data.barbershopId},
        ${parsed.data.name},
        ${parsed.data.phone ?? ""},
        ${specialties},
        'ativo'
      )
    `;

    revalidatePath("/barbearia/barbeiros");
    revalidatePath("/barbearia/dashboard");
    revalidatePath("/agendar/barbearia-do-joao");

    return {
      ok: true,
      message: "Barbeiro cadastrado com sucesso.",
    };
  } catch {
    return {
      ok: false,
      message: "Nao foi possivel cadastrar o barbeiro agora.",
    };
  }
}
