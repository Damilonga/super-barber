"use client";

import { useActionState } from "react";
import { updateFirstAccessPassword, type FirstAccessState } from "./actions";

const initialState: FirstAccessState = {
  ok: false,
  message: "",
};

export function FirstAccessForm() {
  const [state, formAction, isPending] = useActionState(
    updateFirstAccessPassword,
    initialState,
  );

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-sm font-bold text-slate-600">Nova senha</span>
        <input
          name="password"
          type="password"
          placeholder="Minimo 8 caracteres"
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-bold text-slate-600">Confirmar senha</span>
        <input
          name="confirmPassword"
          type="password"
          placeholder="Digite novamente"
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          required
        />
      </label>
      {state.message ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {isPending ? "Salvando..." : "Salvar nova senha"}
      </button>
    </form>
  );
}
