"use server";

import { revalidatePath } from "next/cache";
import { getSql } from "@/lib/db/client";
import { appointmentSchema } from "@/lib/validators/schemas";

export type CreateAppointmentState = {
  ok: boolean;
  message: string;
};

function addMinutesToTime(time: string, minutes: number) {
  const [hours, mins] = time.split(":").map(Number);
  const total = hours * 60 + mins + minutes;
  const endHours = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const endMinutes = (total % 60).toString().padStart(2, "0");

  return `${endHours}:${endMinutes}`;
}

export async function createAppointment(
  _previousState: CreateAppointmentState,
  formData: FormData,
): Promise<CreateAppointmentState> {
  const slug = String(formData.get("slug") ?? "");
  const parsed = appointmentSchema.safeParse({
    barbershopId: formData.get("barbershopId"),
    barberId: formData.get("barberId"),
    serviceId: formData.get("serviceId"),
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    customerEmail: formData.get("customerEmail"),
    appointmentDate: formData.get("appointmentDate"),
    startTime: formData.get("startTime"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revise os dados informados.",
    };
  }

  try {
    const sql = getSql();
    const [service] = (await sql`
      select price, duration_minutes
      from public.services
      where id = ${parsed.data.serviceId}
        and barbershop_id = ${parsed.data.barbershopId}
        and status = 'ativo'
      limit 1
    `) as { price: string; duration_minutes: number }[];

    if (!service) {
      return {
        ok: false,
        message: "Servico indisponivel para agendamento.",
      };
    }

    const [conflict] = (await sql`
      select id
      from public.appointments
      where barber_id = ${parsed.data.barberId}
        and appointment_date = ${parsed.data.appointmentDate}
        and start_time = ${parsed.data.startTime}
        and status not in ('cancelado', 'ausente')
      limit 1
    `) as { id: string }[];

    if (conflict) {
      return {
        ok: false,
        message: "Esse horario acabou de ser ocupado. Escolha outro horario.",
      };
    }

    const endTime = addMinutesToTime(parsed.data.startTime, service.duration_minutes);

    await sql`
      insert into public.appointments (
        barbershop_id,
        barber_id,
        service_id,
        customer_name,
        customer_phone,
        customer_email,
        appointment_date,
        start_time,
        end_time,
        status,
        value
      ) values (
        ${parsed.data.barbershopId},
        ${parsed.data.barberId},
        ${parsed.data.serviceId},
        ${parsed.data.customerName},
        ${parsed.data.customerPhone},
        ${parsed.data.customerEmail ?? ""},
        ${parsed.data.appointmentDate},
        ${parsed.data.startTime},
        ${endTime},
        'agendado',
        ${service.price}
      )
    `;

    revalidatePath("/barbearia/agenda");
    revalidatePath("/barbearia/dashboard");
    revalidatePath(`/agendar/${slug}`);

    return {
      ok: true,
      message: "Agendamento confirmado com sucesso.",
    };
  } catch {
    return {
      ok: false,
      message: "Nao foi possivel confirmar o agendamento agora.",
    };
  }
}
