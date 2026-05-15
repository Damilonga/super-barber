"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, Clock, Scissors, UserRound } from "lucide-react";
import type { Appointment, AvailableHour, Barber, Barbershop, Service } from "@/types";
import { createAppointment, type CreateAppointmentState } from "./actions";

type BookingFormProps = {
  shop: Barbershop;
  barbers: Barber[];
  services: Service[];
  availableHours: AvailableHour[];
  appointments: Appointment[];
};

const initialState: CreateAppointmentState = {
  ok: false,
  message: "",
};

function getTodayInputValue() {
  return new Date().toLocaleDateString("en-CA");
}

function getWeekday(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).getDay();
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

function overlaps(
  startTime: string,
  durationMinutes: number,
  appointment: Appointment,
) {
  const slotStart = timeToMinutes(startTime);
  const slotEnd = slotStart + durationMinutes;
  const appointmentStart = timeToMinutes(appointment.startTime);
  const appointmentEnd = timeToMinutes(appointment.endTime);

  return slotStart < appointmentEnd && slotEnd > appointmentStart;
}

function getDefaultAvailability(barberId: string, weekday: number): AvailableHour[] {
  if (weekday === 0) {
    return [];
  }

  return [
    {
      id: `default-${barberId}-${weekday}`,
      barbershopId: "",
      barberId,
      weekday,
      startTime: "09:00",
      endTime: "18:00",
      intervalMinutes: 30,
      active: true,
    },
  ];
}

export function BookingForm({
  shop,
  barbers,
  services,
  availableHours,
  appointments,
}: BookingFormProps) {
  const [state, formAction, isPending] = useActionState(
    createAppointment,
    initialState,
  );
  const [selectedBarberId, setSelectedBarberId] = useState(barbers[0]?.id ?? "");
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id ?? "");
  const [selectedDate, setSelectedDate] = useState(getTodayInputValue());
  const [selectedTime, setSelectedTime] = useState("");
  const [formVersion, setFormVersion] = useState(0);

  const selectedService = services.find((service) => service.id === selectedServiceId);
  const selectedBarber = barbers.find((barber) => barber.id === selectedBarberId);

  const availableTimes = useMemo(() => {
    if (!selectedBarberId || !selectedService || !selectedDate) {
      return [];
    }

    const weekday = getWeekday(selectedDate);
    const configuredWindows = availableHours.filter(
      (window) => window.barberId === selectedBarberId && window.weekday === weekday,
    );
    const windows = configuredWindows.length
      ? configuredWindows
      : getDefaultAvailability(selectedBarberId, weekday);
    const busyAppointments = appointments.filter(
      (appointment) =>
        appointment.barberId === selectedBarberId &&
        appointment.date === selectedDate,
    );

    return windows.flatMap((window) => {
      const intervalMinutes = Math.max(window.intervalMinutes, 15);
      const firstSlot = timeToMinutes(window.startTime);
      const lastStart = timeToMinutes(window.endTime) - selectedService.durationMinutes;
      const slots: string[] = [];

      for (let minutes = firstSlot; minutes <= lastStart; minutes += intervalMinutes) {
        const time = minutesToTime(minutes);
        const isBusy = busyAppointments.some((appointment) =>
          overlaps(time, selectedService.durationMinutes, appointment),
        );

        if (!isBusy) {
          slots.push(time);
        }
      }

      return slots;
    });
  }, [appointments, availableHours, selectedBarberId, selectedDate, selectedService]);

  const selectedTimeIsAvailable = availableTimes.includes(selectedTime);
  const currentSelectedTime = selectedTimeIsAvailable
    ? selectedTime
    : availableTimes[0] ?? "";

  useEffect(() => {
    if (state.ok) {
      const timeoutId = window.setTimeout(() => {
        setFormVersion((version) => version + 1);
        setSelectedTime("");
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [state.ok]);

  return (
    <form
      key={formVersion}
      action={formAction}
      className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]"
    >
      <input type="hidden" name="slug" value={shop.slug} />

      <div className="space-y-5">
        <fieldset className="rounded-lg border border-slate-200 p-4">
          <legend className="flex items-center gap-2 px-1 text-sm font-semibold text-slate-950">
            <UserRound size={16} aria-hidden="true" />
            Barbeiro
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {barbers.map((barber) => (
              <label
                key={barber.id}
                className={`rounded-md border p-3 text-sm font-medium transition ${
                  selectedBarberId === barber.id
                    ? "border-blue-600 bg-blue-50 text-blue-800"
                    : "border-slate-200 text-slate-700"
                }`}
              >
                <input
                  className="mr-2"
                  type="radio"
                  name="barberId"
                  value={barber.id}
                  checked={selectedBarberId === barber.id}
                  onChange={() => setSelectedBarberId(barber.id)}
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
            {services.map((service) => (
              <label
                key={service.id}
                className={`rounded-md border p-3 text-sm font-medium transition ${
                  selectedServiceId === service.id
                    ? "border-blue-600 bg-blue-50 text-blue-800"
                    : "border-slate-200 text-slate-700"
                }`}
              >
                <input
                  className="mr-2"
                  type="radio"
                  name="serviceId"
                  value={service.id}
                  checked={selectedServiceId === service.id}
                  onChange={() => setSelectedServiceId(service.id)}
                  required
                />
                {service.name} - R$ {service.price} - {service.durationMinutes} min
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
              value={selectedDate}
              min={getTodayInputValue()}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm"
              required
            />
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time) => (
                <label
                  key={time}
                  className={`rounded-md border px-3 py-2 text-center text-sm font-medium transition ${
                    currentSelectedTime === time
                      ? "border-blue-600 bg-blue-700 text-white"
                      : "border-slate-200 text-slate-700 hover:border-blue-300"
                  }`}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="startTime"
                    value={time}
                    checked={currentSelectedTime === time}
                    onChange={() => setSelectedTime(time)}
                    required
                  />
                  {time}
                </label>
              ))}
              {!availableTimes.length ? (
                <p className="col-span-full rounded-md bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
                  Nenhum horario disponivel para {selectedBarber?.name ?? "esse barbeiro"} nessa data.
                </p>
              ) : null}
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
          {state.ok ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              <p className="flex items-center gap-2 font-bold">
                <CheckCircle2 size={16} aria-hidden="true" />
                Agendamento confirmado
              </p>
              <p className="mt-1">
                {selectedService?.name ?? "Servico"} com {selectedBarber?.name ?? "barbeiro"}.
                A barbearia ja recebeu o horario na agenda.
              </p>
            </div>
          ) : state.message ? (
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
            disabled={isPending || !currentSelectedTime}
            className="w-full rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isPending ? "Confirmando..." : "Confirmar agendamento"}
          </button>
        </div>
      </aside>
    </form>
  );
}
