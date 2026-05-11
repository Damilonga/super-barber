"use client";

import type { AppointmentStatus } from "@/types";
import { updateAppointmentStatus } from "./actions";

type AppointmentStatusSelectProps = {
  appointmentId: string;
  barbershopId: string;
  status: AppointmentStatus;
};

const statuses: { value: AppointmentStatus; label: string }[] = [
  { value: "agendado", label: "Agendado" },
  { value: "confirmado", label: "Confirmado" },
  { value: "atendido", label: "Atendido" },
  { value: "cancelado", label: "Cancelado" },
  { value: "ausente", label: "Ausente" },
];

export function AppointmentStatusSelect({
  appointmentId,
  barbershopId,
  status,
}: AppointmentStatusSelectProps) {
  return (
    <form action={updateAppointmentStatus}>
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <input type="hidden" name="barbershopId" value={barbershopId} />
      <select
        name="status"
        defaultValue={status}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="h-9 rounded-md border border-slate-200 bg-white px-2 text-xs font-bold text-slate-600 ring-1 ring-slate-100"
        aria-label="Alterar status do agendamento"
      >
        {statuses.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </form>
  );
}
