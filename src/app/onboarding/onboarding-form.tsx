"use client";

import { useActionState } from "react";
import type { Barbershop } from "@/types";
import { completeOnboarding, type OnboardingState } from "./actions";

type OnboardingFormProps = {
  shop: Barbershop;
};

const initialState: OnboardingState = {
  ok: false,
  message: "",
};

export function OnboardingForm({ shop }: OnboardingFormProps) {
  const [state, formAction, isPending] = useActionState(
    completeOnboarding,
    initialState,
  );

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="barbershopId" value={shop.id} />
      <label className="block">
        <span className="text-sm font-bold text-slate-600">Nome publico</span>
        <input
          name="name"
          defaultValue={shop.name}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-bold text-slate-600">Telefone</span>
        <input
          name="phone"
          type="tel"
          defaultValue={shop.phone}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-bold text-slate-600">Endereco</span>
        <input
          name="address"
          placeholder="Rua, numero, bairro"
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-bold text-slate-600">Apresentacao publica</span>
        <textarea
          name="publicIntro"
          defaultValue="Agende seu corte com rapidez e escolha seu barbeiro favorito."
          className="mt-2 min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-bold text-slate-600">Cor principal</span>
        <input
          name="primaryColor"
          type="color"
          defaultValue={shop.primaryColor}
          className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-2 py-1"
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
        {isPending ? "Salvando..." : "Concluir configuracao"}
      </button>
    </form>
  );
}
