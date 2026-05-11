import { Search, Scissors } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getBarbershopForUser } from "@/lib/auth/barbershop-context";
import { requireUser } from "@/lib/auth/guards";
import { requireCompletedOnboarding } from "@/lib/auth/onboarding-guard";
import { getServicesByBarbershopId } from "@/lib/db/queries";
import { CreateServiceForm } from "./create-service-form";
import { ServiceRowActions } from "./service-row-actions";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const user = await requireUser();
  const shop = await getBarbershopForUser(user);
  requireCompletedOnboarding(user, shop);
  const services = shop ? await getServicesByBarbershopId(shop.id) : [];

  return (
    <AppShell
      area="barbearia"
      title="Servicos"
      eyebrow={
        shop
          ? `${services.length} servicos cadastrados`
          : "Nenhuma barbearia cadastrada"
      }
      activeLabel="Servicos"
    >
      {shop ? <CreateServiceForm barbershopId={shop.id} /> : null}

      <label className="relative block">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
          size={20}
          aria-hidden="true"
        />
        <input
          placeholder="Buscar servicos..."
          className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-700 shadow-sm placeholder:text-slate-400"
        />
      </label>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1.4fr_140px_140px_120px_190px] border-b border-slate-100 px-5 py-3 text-sm font-bold text-slate-500">
          <span>Servico</span>
          <span>Valor</span>
          <span>Duracao</span>
          <span>Status</span>
          <span>Acoes</span>
        </div>
        {services.map((service) => (
          <div
            key={service.id}
            className="grid grid-cols-[1.4fr_140px_140px_120px_190px] items-center border-b border-slate-100 px-5 py-4 text-sm last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Scissors size={17} aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold text-slate-800">{service.name}</p>
                <p className="text-xs font-medium text-slate-400">
                  {service.description || "Visivel no agendamento publico"}
                </p>
              </div>
            </div>
            <p className="font-medium text-slate-700">R$ {service.price}</p>
            <p className="text-slate-600">{service.durationMinutes} min</p>
            <span
              className={`w-fit rounded-md px-3 py-1 text-xs font-bold ring-1 ${
                service.status === "ativo"
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                  : "bg-slate-100 text-slate-500 ring-slate-200"
              }`}
            >
              {service.status}
            </span>
            <ServiceRowActions service={service} />
          </div>
        ))}
      </section>
    </AppShell>
  );
}
