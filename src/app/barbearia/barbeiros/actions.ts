"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/guards";
import { getSql } from "@/lib/db/client";
import { barberSchema, updateBarberSchema } from "@/lib/validators/schemas";

export type CreateBarberState = {
  ok: boolean;
  message: string;
};

export type BarberMutationState = {
  ok: boolean;
  message: string;
};

function parseSpecialties(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function canManageBarbershop(
  user: Awaited<ReturnType<typeof requireUser>>,
  barbershopId: string,
) {
  return user.role === "super_admin" || user.barbershopId === barbershopId;
}

function revalidateBarberPaths(slug?: string) {
  revalidatePath("/barbearia/barbeiros");
  revalidatePath("/barbearia/dashboard");

  if (slug) {
    revalidatePath(`/agendar/${slug}`);
  }
}

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

  if (!canManageBarbershop(user, parsed.data.barbershopId)) {
    return {
      ok: false,
      message: "Voce nao tem permissao para cadastrar nessa barbearia.",
    };
  }

  const specialties = parseSpecialties(parsed.data.specialties);

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

    const [shop] = (await sql`
      select slug
      from public.barbershops
      where id = ${parsed.data.barbershopId}
      limit 1
    `) as { slug: string }[];

    revalidateBarberPaths(shop?.slug);

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

export async function updateBarber(
  _previousState: BarberMutationState,
  formData: FormData,
): Promise<BarberMutationState> {
  const user = await requireUser();
  const parsed = updateBarberSchema.safeParse({
    barberId: formData.get("barberId"),
    barbershopId: formData.get("barbershopId"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    specialties: formData.get("specialties"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revise os dados informados.",
    };
  }

  if (!canManageBarbershop(user, parsed.data.barbershopId)) {
    return {
      ok: false,
      message: "Voce nao tem permissao para editar esse barbeiro.",
    };
  }

  try {
    const sql = getSql();
    const [updated] = (await sql`
      update public.barbers
      set
        name = ${parsed.data.name},
        phone = ${parsed.data.phone ?? ""},
        specialties = ${parseSpecialties(parsed.data.specialties)},
        status = ${parsed.data.status}
      where id = ${parsed.data.barberId}
        and barbershop_id = ${parsed.data.barbershopId}
      returning id
    `) as { id: string }[];

    if (!updated) {
      return {
        ok: false,
        message: "Barbeiro nao encontrado.",
      };
    }

    const [shop] = (await sql`
      select slug
      from public.barbershops
      where id = ${parsed.data.barbershopId}
      limit 1
    `) as { slug: string }[];

    revalidateBarberPaths(shop?.slug);

    return {
      ok: true,
      message: "Barbeiro atualizado com sucesso.",
    };
  } catch {
    return {
      ok: false,
      message: "Nao foi possivel atualizar o barbeiro agora.",
    };
  }
}

export async function toggleBarberStatus(formData: FormData) {
  const user = await requireUser();
  const barberId = String(formData.get("barberId") ?? "");
  const barbershopId = String(formData.get("barbershopId") ?? "");
  const nextStatus = String(formData.get("nextStatus") ?? "");

  if (
    !barberId ||
    !barbershopId ||
    (nextStatus !== "ativo" && nextStatus !== "inativo")
  ) {
    return;
  }

  if (!canManageBarbershop(user, barbershopId)) {
    return;
  }

  const sql = getSql();
  await sql`
    update public.barbers
    set status = ${nextStatus}
    where id = ${barberId}
      and barbershop_id = ${barbershopId}
  `;

  const [shop] = (await sql`
    select slug
    from public.barbershops
    where id = ${barbershopId}
    limit 1
  `) as { slug: string }[];

  revalidateBarberPaths(shop?.slug);
}
