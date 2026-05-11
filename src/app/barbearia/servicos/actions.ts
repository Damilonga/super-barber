"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/guards";
import { getSql } from "@/lib/db/client";
import { serviceSchema, updateServiceSchema } from "@/lib/validators/schemas";

export type CreateServiceState = {
  ok: boolean;
  message: string;
};

export type ServiceMutationState = {
  ok: boolean;
  message: string;
};

function canManageBarbershop(
  user: Awaited<ReturnType<typeof requireUser>>,
  barbershopId: string,
) {
  return user.role === "super_admin" || user.barbershopId === barbershopId;
}

function revalidateServicePaths(slug?: string) {
  revalidatePath("/barbearia/servicos");
  revalidatePath("/barbearia/dashboard");

  if (slug) {
    revalidatePath(`/agendar/${slug}`);
  }
}

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

  if (!canManageBarbershop(user, parsed.data.barbershopId)) {
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

    const [shop] = (await sql`
      select slug
      from public.barbershops
      where id = ${parsed.data.barbershopId}
      limit 1
    `) as { slug: string }[];

    revalidateServicePaths(shop?.slug);

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

export async function updateService(
  _previousState: ServiceMutationState,
  formData: FormData,
): Promise<ServiceMutationState> {
  const user = await requireUser();
  const parsed = updateServiceSchema.safeParse({
    serviceId: formData.get("serviceId"),
    barbershopId: formData.get("barbershopId"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    durationMinutes: formData.get("durationMinutes"),
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
      message: "Voce nao tem permissao para editar esse servico.",
    };
  }

  try {
    const sql = getSql();
    const [updated] = (await sql`
      update public.services
      set
        name = ${parsed.data.name},
        description = ${parsed.data.description ?? ""},
        price = ${parsed.data.price},
        duration_minutes = ${parsed.data.durationMinutes},
        status = ${parsed.data.status}
      where id = ${parsed.data.serviceId}
        and barbershop_id = ${parsed.data.barbershopId}
      returning id
    `) as { id: string }[];

    if (!updated) {
      return {
        ok: false,
        message: "Servico nao encontrado.",
      };
    }

    const [shop] = (await sql`
      select slug
      from public.barbershops
      where id = ${parsed.data.barbershopId}
      limit 1
    `) as { slug: string }[];

    revalidateServicePaths(shop?.slug);

    return {
      ok: true,
      message: "Servico atualizado com sucesso.",
    };
  } catch {
    return {
      ok: false,
      message: "Nao foi possivel atualizar o servico agora.",
    };
  }
}

export async function toggleServiceStatus(formData: FormData) {
  const user = await requireUser();
  const serviceId = String(formData.get("serviceId") ?? "");
  const barbershopId = String(formData.get("barbershopId") ?? "");
  const nextStatus = String(formData.get("nextStatus") ?? "");

  if (
    !serviceId ||
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
    update public.services
    set status = ${nextStatus}
    where id = ${serviceId}
      and barbershop_id = ${barbershopId}
  `;

  const [shop] = (await sql`
    select slug
    from public.barbershops
    where id = ${barbershopId}
    limit 1
  `) as { slug: string }[];

  revalidateServicePaths(shop?.slug);
}
