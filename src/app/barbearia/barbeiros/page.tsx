import { Mail, Search, UserRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getBarbershopForUser } from "@/lib/auth/barbershop-context";
import { requireUser } from "@/lib/auth/guards";
import { requireCompletedOnboarding } from "@/lib/auth/onboarding-guard";
import { getBarbersByBarbershopId } from "@/lib/db/queries";
import { BarberRowActions } from "./barber-row-actions";
import { CreateBarberForm } from "./create-barber-form";

export const dynamic = "force-dynamic";

export default async function BarbersPage() {
  const user = await requireUser();
  const shop = await getBarbershopForUser(user);
  requireCompletedOnboarding(user, shop);
  const barbers = shop ? await getBarbersByBarbershopId(shop.id) : [];

  return (
    <AppShell
      area="barbearia"
      title="Barbeiros"
      eyebrow={
        shop
          ? `${barbers.length} profissionais cadastrados`
          : "Nenhuma barbearia cadastrada"
      }
      activeLabel="Barbeiros"
    >
      {shop ? <CreateBarberForm barbershopId={shop.id} /> : null}

      <label className="relative block">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
          size={20}
          aria-hidden="true"
        />
        <input
          placeholder="Buscar barbeiros..."
          className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-700 shadow-sm placeholder:text-slate-400"
        />
      </label>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_180px] border-b border-slate-100 px-5 py-3 text-sm font-bold text-slate-500">
          <span>Barbeiro</span>
          <span>Telefone</span>
          <span>Status</span>
          <span>Acoes</span>
        </div>
        {barbers.map((barber) => (
          <div
            key={barber.id}
            className="grid grid-cols-[1.4fr_1fr_1fr_180px] items-center border-b border-slate-100 px-5 py-4 text-sm last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <UserRound size={17} aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold text-slate-800">{barber.name}</p>
                <p className="text-xs font-medium text-slate-400">
                  {barber.specialties.join(", ")}
                </p>
              </div>
            </div>
            <span className="text-slate-600">{barber.phone}</span>
            <span
              className={`w-fit rounded-md px-3 py-1 text-xs font-bold ring-1 ${
                barber.status === "ativo"
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                  : "bg-slate-100 text-slate-500 ring-slate-200"
              }`}
            >
              {barber.status}
            </span>
            <div className="flex items-center gap-2 text-slate-300">
              <button aria-label="Enviar mensagem" className="transition hover:text-slate-600">
                <Mail size={17} aria-hidden="true" />
              </button>
              <BarberRowActions barber={barber} />
            </div>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
