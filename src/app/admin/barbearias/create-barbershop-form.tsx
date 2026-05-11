"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { createBarbershop, type CreateBarbershopState } from "./actions";

const initialState: CreateBarbershopState = {
  ok: false,
  message: "",
};

export function CreateBarbershopForm() {
  const [state, formAction, isPending] = useActionState(
    createBarbershop,
    initialState,
  );

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-slate-950">Nova barbearia</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Cadastre um cliente para liberar o painel e link de agendamento.
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

      <form action={formAction} className="mt-5 grid gap-3 lg:grid-cols-6">
        <input
          name="name"
          placeholder="Nome da barbearia"
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 lg:col-span-2"
          required
        />
        <input
          name="ownerName"
          placeholder="Responsavel"
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="email@barbearia.com"
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700"
          required
        />
        <input
          name="phone"
          type="tel"
          placeholder="(11) 99999-9999"
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700"
          required
        />
        <select
          name="plan"
          defaultValue="Start"
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700"
        >
          <option>Start</option>
          <option>Pro</option>
          <option>Premium</option>
        </select>
        <input
          name="address"
          placeholder="Endereco"
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 lg:col-span-5"
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

      {state.credentials ? (
        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <h3 className="text-sm font-bold text-blue-950">Acesso inicial da barbearia</h3>
          <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
            <div>
              <p className="font-bold text-blue-700">E-mail</p>
              <p className="mt-1 font-medium text-slate-700">
                {state.credentials.email}
              </p>
            </div>
            <div>
              <p className="font-bold text-blue-700">Senha temporaria</p>
              <p className="mt-1 font-mono text-slate-900">
                {state.credentials.temporaryPassword}
              </p>
            </div>
            <div>
              <p className="font-bold text-blue-700">Link de login</p>
              <p className="mt-1 font-medium text-slate-700">
                {state.credentials.loginUrl}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs font-medium text-blue-800">
            Envie esses dados manualmente para o cliente. A senha deve ser trocada no
            primeiro acesso.
          </p>
        </div>
      ) : null}
    </section>
  );
}
