"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {
  ok: false,
  message: "",
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-slate-700">E-mail</span>
        <input
          name="email"
          type="email"
          placeholder="voce@email.com"
          className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Senha</span>
        <input
          name="password"
          type="password"
          placeholder="Sua senha"
          className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          required
        />
      </label>
      {state.message ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
