"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { createBarber, type CreateBarberState } from "./actions";

type CreateBarberFormProps = {
  barbershopId: string;
};

const initialState: CreateBarberState = {
  ok: false,
  message: "",
};

export function CreateBarberForm({ barbershopId }: CreateBarberFormProps) {
  const [state, formAction, isPending] = useActionState(createBarber, initialState);

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-slate-950">Novo barbeiro</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Adicione profissionais que aparecerao no link de agendamento.
          </p>
        </div>
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
      </div>

      <form action={formAction} className="mt-5 grid gap-3 lg:grid-cols-[1fr_180px_1fr_160px]">
        <input type="hidden" name="barbershopId" value={barbershopId} />
        <input
          name="name"
          placeholder="Nome do barbeiro"
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700"
          required
        />
        <input
          name="phone"
          type="tel"
          placeholder="Telefone"
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700"
        />
        <input
          name="specialties"
          placeholder="Especialidades separadas por virgula"
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700"
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          <Plus size={16} aria-hidden="true" />
          {isPending ? "Salvando..." : "Cadastrar"}
        </button>
      </form>
    </section>
  );
}
