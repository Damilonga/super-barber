"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/guards";
import { getSql } from "@/lib/db/client";
import { serviceSchema } from "@/lib/validators/schemas";

export type CreateServiceState = {
  ok: boolean;
  message: string;
};

export async function createService(
  _previousState: CreateServiceState,
  formData: FormData,
): Promise<CreateServiceState> {
  const user = await requireUser();
  const parsed = serviceSchema.safeParse({
    barbershopId: formData.get("barbershopId"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    durationMinutes: formData.get("durationMinutes"),
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

  try {
    const sql = getSql();

    await sql`
      insert into public.services (
        barbershop_id,
        name,
        description,
        price,
        duration_minutes,
        status
      ) values (
        ${parsed.data.barbershopId},
        ${parsed.data.name},
        ${parsed.data.description ?? ""},
        ${parsed.data.price},
        ${parsed.data.durationMinutes},
        'ativo'
      )
    `;

    revalidatePath("/barbearia/servicos");
    revalidatePath("/barbearia/dashboard");
    revalidatePath("/agendar/barbearia-do-joao");

    return {
      ok: true,
      message: "Servico cadastrado com sucesso.",
    };
  } catch {
    return {
      ok: false,
      message: "Nao foi possivel cadastrar o servico agora.",
    };
  }
}
