import Link from "next/link";
import { ExternalLink, ImageUp, Palette, Save } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getBarbershopForUser } from "@/lib/auth/barbershop-context";
import { requireUser } from "@/lib/auth/guards";
import { requireCompletedOnboarding } from "@/lib/auth/onboarding-guard";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();
  const shop = await getBarbershopForUser(user);
  requireCompletedOnboarding(user, shop);

  return (
    <AppShell
      area="barbearia"
      title="Configuracoes"
      eyebrow={shop ? "Marca e link publico" : "Nenhuma barbearia cadastrada"}
      activeLabel="Configuracoes"
    >
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-950">Identidade da barbearia</h2>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[260px_1fr]">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
            <div className="flex aspect-square items-center justify-center rounded-xl bg-white text-blue-600 ring-1 ring-slate-200">
              <ImageUp size={34} aria-hidden="true" />
            </div>
            <button className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
              Enviar logo
            </button>
          </div>

          <div>
            <div className="grid gap-5 lg:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-slate-500">Nome publico</span>
                <input
                  defaultValue={shop?.name ?? ""}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-500">Slug do link</span>
                <input
                  defaultValue={shop?.slug ?? ""}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700"
                />
              </label>
              <label className="block">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-500">
                  <Palette size={15} aria-hidden="true" />
                  Cor principal
                </span>
                <input
                  type="color"
                  defaultValue={shop?.primaryColor ?? "#2563eb"}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-2 py-1"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-500">Telefone</span>
                <input
                  type="tel"
                  defaultValue={shop?.phone ?? ""}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700"
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-bold text-slate-500">Texto publico</span>
          <textarea
            defaultValue="Agende seu corte com rapidez e escolha seu barbeiro favorito."
                className="mt-2 min-h-28 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
          />
            </label>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <ExternalLink size={16} className="text-slate-400" aria-hidden="true" />
                Link publico:{" "}
                <Link
                  className="font-bold text-blue-700"
                  href={`/agendar/${shop?.slug ?? "barbearia-do-joao"}`}
                >
                  /agendar/{shop?.slug ?? "barbearia-do-joao"}
                </Link>
              </p>
              <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700">
                <Save size={16} aria-hidden="true" />
                Salvar configuracoes
              </button>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
