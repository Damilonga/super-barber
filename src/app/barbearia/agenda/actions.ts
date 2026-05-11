"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/guards";
import { getSql } from "@/lib/db/client";
import { updateAppointmentStatusSchema } from "@/lib/validators/schemas";

export async function updateAppointmentStatus(formData: FormData) {
  const user = await requireUser();
  const parsed = updateAppointmentStatusSchema.safeParse({
    appointmentId: formData.get("appointmentId"),
    barbershopId: formData.get("barbershopId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return;
  }

  if (
    user.role === "barbearia_admin" &&
    user.barbershopId !== parsed.data.barbershopId
  ) {
    return;
  }

  const sql = getSql();
  await sql`
    update public.appointments
    set
      status = ${parsed.data.status},
      updated_at = now()
    where id = ${parsed.data.appointmentId}
      and barbershop_id = ${parsed.data.barbershopId}
  `;

  revalidatePath("/barbearia/agenda");
  revalidatePath("/barbearia/dashboard");
}
