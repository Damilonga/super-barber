"use client";

import { useActionState } from "react";
import { CalendarCheck, Clock, Scissors, UserRound } from "lucide-react";
import type { Barber, Barbershop, Service } from "@/types";
import { createAppointment, type CreateAppointmentState } from "./actions";

type BookingFormProps = {
  shop: Barbershop;
  barbers: Barber[];
  services: Service[];
};

const initialState: CreateAppointmentState = {
  ok: false,
  message: "",
};

const availableTimes = ["09:00", "10:00", "11:30", "14:00", "15:30", "17:00"];

export function BookingForm({ shop, barbers, services }: BookingFormProps) {
  const [state, formAction, isPending] = useActionState(
    createAppointment,
    initialState,
  );

  return (
    <form action={formAction} className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
      <input type="hidden" name="barbershopId" value={shop.id} />
      <input type="hidden" name="slug" value={shop.slug} />

      <div className="space-y-5">
        <fieldset className="rounded-lg border border-slate-200 p-4">
          <legend className="flex items-center gap-2 px-1 text-sm font-semibold text-slate-950">
            <UserRound size={16} aria-hidden="true" />
            Barbeiro
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {barbers.map((barber, index) => (
              <label
                key={barber.id}
                className="rounded-md border border-slate-200 p-3 text-sm font-medium text-slate-700"
              >
                <input
                  className="mr-2"
                  type="radio"
                  name="barberId"
                  value={barber.id}
                  defaultChecked={index === 0}
                  required
                />
                {barber.name}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-slate-200 p-4">
          <legend className="flex items-center gap-2 px-1 text-sm font-semibold text-slate-950">
            <Scissors size={16} aria-hidden="true" />
            Servico
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {services.map((service, index) => (
              <label
                key={service.id}
                className="rounded-md border border-slate-200 p-3 text-sm font-medium text-slate-700"
              >
                <input
                  className="mr-2"
                  type="radio"
                  name="serviceId"
                  value={service.id}
                  defaultChecked={index === 0}
                  required
                />
                {service.name} - R$ {service.price}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-slate-200 p-4">
          <legend className="flex items-center gap-2 px-1 text-sm font-semibold text-slate-950">
            <Clock size={16} aria-hidden="true" />
            Data e horario
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-[180px_1fr]">
            <input
              name="appointmentDate"
              type="date"
              defaultValue="2026-05-08"
              className="rounded-md border border-slate-200 px-3 py-2 text-sm"
              required
            />
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time, index) => (
                <label
                  key={time}
                  className="rounded-md border border-slate-200 px-3 py-2 text-center text-sm font-medium text-slate-700"
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="startTime"
                    value={time}
                    defaultChecked={index === 2}
                    required
                  />
                  {time}
                </label>
              ))}
            </div>
          </div>
        </fieldset>
      </div>

      <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h2 className="flex items-center gap-2 font-semibold text-slate-950">
          <CalendarCheck size={18} aria-hidden="true" />
          Seus dados
        </h2>
        <div className="mt-4 space-y-4">
          <input
            name="customerName"
            placeholder="Nome completo"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            required
          />
          <input
            name="customerPhone"
            type="tel"
            placeholder="Telefone"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            required
          />
          <input
            name="customerEmail"
            type="email"
            placeholder="E-mail"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
          {state.message ? (
            <p
              className={`rounded-lg px-3 py-2 text-sm font-bold ${
                state.ok
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {state.message}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isPending ? "Confirmando..." : "Confirmar agendamento"}
          </button>
        </div>
      </aside>
    </form>
  );
}
