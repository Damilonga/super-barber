"use client";

import { useActionState, useState } from "react";
import { Check, Power, PowerOff, X } from "lucide-react";
import type { Service } from "@/types";
import {
  toggleServiceStatus,
  updateService,
  type ServiceMutationState,
} from "./actions";

type ServiceRowActionsProps = {
  service: Service;
};

const initialState: ServiceMutationState = {
  ok: false,
  message: "",
};

export function ServiceRowActions({ service }: ServiceRowActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(updateService, initialState);
  const nextStatus = service.status === "ativo" ? "inativo" : "ativo";

  if (isEditing) {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 px-5">
        <section className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-5 shadow-xl">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Editar servico</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Altere valor, duracao e visibilidade do servico.
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
            <input type="hidden" name="serviceId" value={service.id} />
            <input type="hidden" name="barbershopId" value={service.barbershopId} />
            <input
              name="name"
              defaultValue={service.name}
              className="h-11 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700"
              required
            />
            <input
              name="description"
              defaultValue={service.description}
              className="h-11 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700"
              placeholder="Descricao curta"
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                defaultValue={service.price}
                className="h-11 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700"
                required
              />
              <input
                name="durationMinutes"
                type="number"
                min="1"
                step="1"
                defaultValue={service.durationMinutes}
                className="h-11 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700"
                required
              />
              <select
                name="status"
                defaultValue={service.status}
                className="h-11 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700"
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
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
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="rounded-md px-2 py-1 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
      >
        Editar
      </button>
      <form action={toggleServiceStatus}>
        <input type="hidden" name="serviceId" value={service.id} />
        <input type="hidden" name="barbershopId" value={service.barbershopId} />
        <input type="hidden" name="nextStatus" value={nextStatus} />
        <button
          type="submit"
          className={`inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-bold transition ${
            service.status === "ativo"
              ? "text-red-600 hover:bg-red-50"
              : "text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          {service.status === "ativo" ? (
            <PowerOff size={15} aria-hidden="true" />
          ) : (
            <Power size={15} aria-hidden="true" />
          )}
          {service.status === "ativo" ? "Inativar" : "Ativar"}
        </button>
      </form>
    </div>
  );
}
