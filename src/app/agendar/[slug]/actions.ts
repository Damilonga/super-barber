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

function getWeekday(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).getDay();
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.slice(0, 5).split(":").map(Number);
  return hours * 60 + minutes;
}

function isInsideAvailability(
  startTime: string,
  endTime: string,
  windows: { start_time: string; end_time: string }[],
) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  return windows.some((window) => {
    const windowStart = timeToMinutes(window.start_time);
    const windowEnd = timeToMinutes(window.end_time);

    return start >= windowStart && end <= windowEnd;
  });
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
    const [shop] = (await sql`
      select id, status
      from public.barbershops
      where slug = ${slug}
      limit 1
    `) as { id: string; status: string }[];

    if (!shop || shop.status !== "ativa") {
      return {
        ok: false,
        message: "Link de agendamento indisponivel.",
      };
    }

    if (shop.id !== parsed.data.barbershopId) {
      return {
        ok: false,
        message: "Link de agendamento invalido para essa barbearia.",
      };
    }

    const [barber] = (await sql`
      select id
      from public.barbers
      where id = ${parsed.data.barberId}
        and barbershop_id = ${shop.id}
        and status = 'ativo'
      limit 1
    `) as { id: string }[];

    if (!barber) {
      return {
        ok: false,
        message: "Barbeiro indisponivel para agendamento.",
      };
    }

    const [service] = (await sql`
      select price, duration_minutes
      from public.services
      where id = ${parsed.data.serviceId}
        and barbershop_id = ${shop.id}
        and status = 'ativo'
      limit 1
    `) as { price: string; duration_minutes: number }[];

    if (!service) {
      return {
        ok: false,
        message: "Servico indisponivel para agendamento.",
      };
    }

    const endTime = addMinutesToTime(parsed.data.startTime, service.duration_minutes);
    const weekday = getWeekday(parsed.data.appointmentDate);
    const configuredWindows = (await sql`
      select start_time::text as start_time, end_time::text as end_time
      from public.available_hours
      where barbershop_id = ${shop.id}
        and barber_id = ${parsed.data.barberId}
        and weekday = ${weekday}
        and active = true
      order by start_time asc
    `) as { start_time: string; end_time: string }[];

    const availabilityWindows = configuredWindows.length
      ? configuredWindows
      : weekday === 0
        ? []
        : [{ start_time: "09:00", end_time: "18:00" }];

    if (
      !isInsideAvailability(
        parsed.data.startTime,
        endTime,
        availabilityWindows,
      )
    ) {
      return {
        ok: false,
        message: "Esse horario nao esta dentro da agenda do barbeiro.",
      };
    }

    const [conflict] = (await sql`
      select id
      from public.appointments
      where barber_id = ${parsed.data.barberId}
        and appointment_date = ${parsed.data.appointmentDate}
        and start_time < ${endTime}
        and end_time > ${parsed.data.startTime}
        and status not in ('cancelado', 'ausente')
      limit 1
    `) as { id: string }[];

    if (conflict) {
      return {
        ok: false,
        message: "Esse horario acabou de ser ocupado. Escolha outro horario.",
      };
    }

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
        ${shop.id},
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
