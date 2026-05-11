import Link from "next/link";
import { ArrowRight, CalendarCheck, ShieldCheck, Store } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto grid min-h-screen max-w-7xl content-center gap-10 px-6 py-10 lg:grid-cols-[1fr_520px] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800">
            <ShieldCheck size={16} aria-hidden="true" />
            SaaS para barbearias
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-normal text-slate-950">
            Super Barber
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Plataforma para vender, configurar e operar agendas de barbearias
            com painel admin, painel da barbearia e link publico de agendamento.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Acessar painel
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/agendar/barbearia-do-joao"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Ver agendamento publico
            </Link>
            <Link
              href="/planos"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Ver planos
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          <div className="grid gap-4">
            <div className="rounded-lg bg-white p-5 shadow-sm">
              <Store className="text-blue-700" size={24} aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-slate-950">
                Super admin
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Cadastre barbearias, planos, acessos e acompanhe a operacao da
                plataforma.
              </p>
            </div>
            <div className="rounded-lg bg-white p-5 shadow-sm">
              <CalendarCheck className="text-blue-700" size={24} aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-slate-950">
                Painel da barbearia
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Gerencie barbeiros, servicos, horarios, agenda e identidade do
                link publico.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
