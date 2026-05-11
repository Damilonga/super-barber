"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";
import { hashPassword } from "@/lib/auth/password";
import { getSql } from "@/lib/db/client";
import { slugify } from "@/lib/utils/slug";
import {
  barbershopSchema,
  updateBarbershopSchema,
} from "@/lib/validators/schemas";

export type CreateBarbershopState = {
  ok: boolean;
  message: string;
  credentials?: {
    email: string;
    temporaryPassword: string;
    loginUrl: string;
  };
};

export type BarbershopMutationState = {
  ok: boolean;
  message: string;
};

function generateTemporaryPassword() {
  return `SB-${randomBytes(4).toString("hex")}`;
}

function revalidateBarbershopPaths(slug?: string) {
  revalidatePath("/admin/barbearias");
  revalidatePath("/admin/dashboard");

  if (slug) {
    revalidatePath(`/agendar/${slug}`);
  }
}

export async function createBarbershop(
  _previousState: CreateBarbershopState,
  formData: FormData,
): Promise<CreateBarbershopState> {
  await requireRole("super_admin");

  const parsed = barbershopSchema.safeParse({
    name: formData.get("name"),
    ownerName: formData.get("ownerName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    plan: formData.get("plan"),
    address: formData.get("address"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revise os dados informados.",
    };
  }

  const sql = getSql();
  const slug = slugify(parsed.data.name);
  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = hashPassword(temporaryPassword);

  try {
    const [barbershop] = (await sql`
      insert into public.barbershops (
        name,
        slug,
        owner_name,
        email,
        phone,
        address,
        plan,
        status
      ) values (
        ${parsed.data.name},
        ${slug},
        ${parsed.data.ownerName},
        ${parsed.data.email},
        ${parsed.data.phone},
        ${parsed.data.address ?? ""},
        ${parsed.data.plan},
        'ativa'
      )
      returning id
    `) as { id: string }[];

    await sql`
      insert into public.users (
        full_name,
        email,
        password_hash,
        role,
        barbershop_id,
        first_access,
        status
      ) values (
        ${parsed.data.ownerName},
        ${parsed.data.email.toLowerCase()},
        ${passwordHash},
        'barbearia_admin',
        ${barbershop.id},
        true,
        'ativo'
      )
    `;

    revalidateBarbershopPaths(slug);

    return {
      ok: true,
      message: "Barbearia cadastrada e acesso inicial gerado.",
      credentials: {
        email: parsed.data.email.toLowerCase(),
        temporaryPassword,
        loginUrl: "/login",
      },
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return {
        ok: false,
        message: "Ja existe uma barbearia ou usuario com esses dados.",
      };
    }

    return {
      ok: false,
      message: "Nao foi possivel cadastrar a barbearia agora.",
    };
  }
}

export async function updateBarbershop(
  _previousState: BarbershopMutationState,
  formData: FormData,
): Promise<BarbershopMutationState> {
  await requireRole("super_admin");

  const parsed = updateBarbershopSchema.safeParse({
    barbershopId: formData.get("barbershopId"),
    name: formData.get("name"),
    ownerName: formData.get("ownerName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    plan: formData.get("plan"),
    address: formData.get("address"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revise os dados informados.",
    };
  }

  const sql = getSql();
  const nextSlug = slugify(parsed.data.name);

  try {
    const [updated] = (await sql`
      update public.barbershops
      set
        name = ${parsed.data.name},
        slug = ${nextSlug},
        owner_name = ${parsed.data.ownerName},
        email = ${parsed.data.email},
        phone = ${parsed.data.phone},
        address = ${parsed.data.address ?? ""},
        plan = ${parsed.data.plan},
        status = ${parsed.data.status}
      where id = ${parsed.data.barbershopId}
      returning id
    `) as { id: string }[];

    if (!updated) {
      return {
        ok: false,
        message: "Barbearia nao encontrada.",
      };
    }

    await sql`
      update public.users
      set
        full_name = ${parsed.data.ownerName},
        email = ${parsed.data.email.toLowerCase()},
        status = ${parsed.data.status === "ativa" ? "ativo" : "inativo"}
      where barbershop_id = ${parsed.data.barbershopId}
        and role = 'barbearia_admin'
    `;

    revalidateBarbershopPaths(nextSlug);

    return {
      ok: true,
      message: "Barbearia atualizada com sucesso.",
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return {
        ok: false,
        message: "Ja existe uma barbearia ou usuario com esses dados.",
      };
    }

    return {
      ok: false,
      message: "Nao foi possivel atualizar a barbearia agora.",
    };
  }
}

export async function toggleBarbershopStatus(formData: FormData) {
  await requireRole("super_admin");

  const barbershopId = String(formData.get("barbershopId") ?? "");
  const nextStatus = String(formData.get("nextStatus") ?? "");

  if (
    !barbershopId ||
    (nextStatus !== "ativa" && nextStatus !== "inativa" && nextStatus !== "bloqueada")
  ) {
    return;
  }

  const sql = getSql();
  const [shop] = (await sql`
    update public.barbershops
    set status = ${nextStatus}
    where id = ${barbershopId}
    returning slug
  `) as { slug: string }[];

  await sql`
    update public.users
    set status = ${nextStatus === "ativa" ? "ativo" : "inativo"}
    where barbershop_id = ${barbershopId}
      and role = 'barbearia_admin'
  `;

  revalidateBarbershopPaths(shop?.slug);
}
