"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";
import { hashPassword } from "@/lib/auth/password";
import { getSql } from "@/lib/db/client";
import { slugify } from "@/lib/utils/slug";
import { barbershopSchema } from "@/lib/validators/schemas";

export type CreateBarbershopState = {
  ok: boolean;
  message: string;
  credentials?: {
    email: string;
    temporaryPassword: string;
    loginUrl: string;
  };
};

function generateTemporaryPassword() {
  return `SB-${randomBytes(4).toString("hex")}`;
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

    revalidatePath("/admin/barbearias");
    revalidatePath("/admin/dashboard");

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
