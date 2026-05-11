"use client";

import { useActionState, useState } from "react";
import { Check, Power, PowerOff, X } from "lucide-react";
import type { Barber } from "@/types";
import {
  toggleBarberStatus,
  updateBarber,
  type BarberMutationState,
} from "./actions";

type BarberRowActionsProps = {
  barber: Barber;
};

const initialState: BarberMutationState = {
  ok: false,
  message: "",
};

export function BarberRowActions({ barber }: BarberRowActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(updateBarber, initialState);
  const nextStatus = barber.status === "ativo" ? "inativo" : "ativo";

  if (isEditing) {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 px-5">
        <section className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-5 shadow-xl">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Editar barbeiro</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Ajuste os dados que aparecem no painel e no agendamento publico.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:text-slate-800"
              aria-label="Cancelar edicao"
            >
              <X size={17} aria-hidden="true" />
            </button>
          </div>

          <form action={formAction} className="grid gap-3">
            <input type="hidden" name="barberId" value={barber.id} />
            <input type="hidden" name="barbershopId" value={barber.barbershopId} />
            <input
              name="name"
              defaultValue={barber.name}
              className="h-11 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700"
              required
            />
            <input
              name="phone"
              type="tel"
              defaultValue={barber.phone}
              className="h-11 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700"
              placeholder="Telefone"
            />
            <input
              name="specialties"
              defaultValue={barber.specialties.join(", ")}
              className="h-11 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700"
              placeholder="Especialidades"
            />
            <select
              name="status"
              defaultValue={barber.status}
              className="h-11 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
            {state.message ? (
              <p
                className={`text-sm font-bold ${
                  state.ok ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {state.message}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-bold text-white transition hover:bg-blue-800 disabled:bg-blue-300"
            >
              <Check size={17} aria-hidden="true" />
              {isPending ? "Salvando..." : "Salvar alteracoes"}
            </button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-slate-300">
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="rounded-md px-2 py-1 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
      >
        Editar
      </button>
      <form action={toggleBarberStatus}>
        <input type="hidden" name="barberId" value={barber.id} />
        <input type="hidden" name="barbershopId" value={barber.barbershopId} />
        <input type="hidden" name="nextStatus" value={nextStatus} />
        <button
          type="submit"
          className={`inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-bold transition ${
            barber.status === "ativo"
              ? "text-red-600 hover:bg-red-50"
              : "text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          {barber.status === "ativo" ? (
            <PowerOff size={15} aria-hidden="true" />
          ) : (
            <Power size={15} aria-hidden="true" />
          )}
          {barber.status === "ativo" ? "Inativar" : "Ativar"}
        </button>
      </form>
    </div>
  );
}
