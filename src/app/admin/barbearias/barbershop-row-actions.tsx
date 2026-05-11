"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Check, Copy, ExternalLink, Mail, Power, PowerOff, X } from "lucide-react";
import type { Barbershop } from "@/types";
import {
  toggleBarbershopStatus,
  updateBarbershop,
  type BarbershopMutationState,
} from "./actions";

type BarbershopRowActionsProps = {
  shop: Barbershop;
};

const initialState: BarbershopMutationState = {
  ok: false,
  message: "",
};

export function BarbershopRowActions({ shop }: BarbershopRowActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copiar link");
  const [state, formAction, isPending] = useActionState(
    updateBarbershop,
    initialState,
  );
  const nextStatus = shop.status === "ativa" ? "inativa" : "ativa";

  function copyBookingLink() {
    const link = `${window.location.origin}/agendar/${shop.slug}`;
    void navigator.clipboard.writeText(link);
    setCopyLabel("Copiado");
    window.setTimeout(() => setCopyLabel("Copiar link"), 1600);
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/barbearia/dashboard"
        className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
      >
        <ExternalLink size={15} aria-hidden="true" />
        Ver painel
      </Link>
      <a
        href={`mailto:${shop.email}`}
        aria-label="Enviar e-mail"
        className="inline-flex size-8 items-center justify-center rounded-md text-slate-300 transition hover:bg-slate-50 hover:text-slate-600"
      >
        <Mail size={16} aria-hidden="true" />
      </a>
      <button
        type="button"
        onClick={copyBookingLink}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
      >
        <Copy size={15} aria-hidden="true" />
        {copyLabel}
      </button>
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="rounded-md px-2 py-1 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
      >
        Editar
      </button>
      <form action={toggleBarbershopStatus}>
        <input type="hidden" name="barbershopId" value={shop.id} />
        <input type="hidden" name="nextStatus" value={nextStatus} />
        <button
          type="submit"
          className={`inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-bold transition ${
            shop.status === "ativa"
              ? "text-red-600 hover:bg-red-50"
              : "text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          {shop.status === "ativa" ? (
            <PowerOff size={15} aria-hidden="true" />
          ) : (
            <Power size={15} aria-hidden="true" />
          )}
          {shop.status === "ativa" ? "Inativar" : "Ativar"}
        </button>
      </form>

      {isEditing ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 px-5">
          <section className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Editar barbearia
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Atualize dados comerciais e acesso do responsavel.
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
              <input type="hidden" name="barbershopId" value={shop.id} />
              <input
                name="name"
                defaultValue={shop.name}
                className="h-11 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700"
                required
              />
              <input
                name="ownerName"
                defaultValue={shop.ownerName}
                className="h-11 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700"
                required
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  name="email"
                  type="email"
                  defaultValue={shop.email}
                  className="h-11 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700"
                  required
                />
                <input
                  name="phone"
                  type="tel"
                  defaultValue={shop.phone}
                  className="h-11 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700"
                  required
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_150px]">
                <input
                  name="plan"
                  defaultValue={shop.plan}
                  className="h-11 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700"
                  required
                />
                <select
                  name="status"
                  defaultValue={shop.status}
                  className="h-11 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700"
                >
                  <option value="ativa">Ativa</option>
                  <option value="inativa">Inativa</option>
                  <option value="bloqueada">Bloqueada</option>
                </select>
              </div>
              <input
                name="address"
                defaultValue={shop.address}
                placeholder="Endereco"
                className="h-11 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700"
              />
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
      ) : null}
    </div>
  );
}
