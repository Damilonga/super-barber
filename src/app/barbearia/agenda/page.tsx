import { CalendarDays, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getBarbershopForUser } from "@/lib/auth/barbershop-context";
import { requireUser } from "@/lib/auth/guards";
import { requireCompletedOnboarding } from "@/lib/auth/onboarding-guard";
import {
  getAppointmentsByBarbershopId,
  getBarbersByBarbershopId,
  getServicesByBarbershopId,
} from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const user = await requireUser();
  const shop = await getBarbershopForUser(user);

  requireCompletedOnboarding(user, shop);

  if (!shop) {
    return (
      <AppShell
        area="barbearia"
        title="Agenda"
        eyebrow="Nenhuma barbearia cadastrada"
        activeLabel="Agenda"
      >
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Cadastre uma barbearia para visualizar a agenda.
          </p>
        </section>
      </AppShell>
    );
  }

  const [appointments, barbers, services] = await Promise.all([
    getAppointmentsByBarbershopId(shop.id),
    getBarbersByBarbershopId(shop.id),
    getServicesByBarbershopId(shop.id),
  ]);

  return (
    <AppShell
      area="barbearia"
      title="Agenda"
      eyebrow={`${appointments.length} horarios no dia`}
      activeLabel="Agenda"
    >
      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-bold text-slate-950">
            <CalendarDays size={18} className="text-blue-600" aria-hidden="true" />
            Filtros
          </h2>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-500">Data</span>
              <input
                type="date"
                defaultValue="2026-05-08"
                className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-500">Barbeiro</span>
              <select className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700">
                <option>Todos</option>
                {barbers.map((barber) => (
                  <option key={barber.id}>{barber.name}</option>
                ))}
              </select>
            </label>
            <label className="relative block">
              <Search
                className="pointer-events-none absolute left-3 top-[42px] text-slate-300"
                size={18}
                aria-hidden="true"
              />
              <span className="text-sm font-bold text-slate-500">Cliente</span>
              <input
                placeholder="Buscar cliente"
                className="mt-2 h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm font-medium text-slate-700"
              />
            </label>
          </div>
        </aside>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-950">Agenda do dia</h2>
          </div>
          <div className="grid grid-cols-[140px_1fr_180px_120px] border-b border-slate-100 px-5 py-3 text-sm font-bold text-slate-500">
            <span>Horario</span>
            <span>Cliente</span>
            <span>Servico</span>
            <span>Status</span>
          </div>
          <div>
            {appointments.map((appointment) => {
              const service = services.find((item) => item.id === appointment.serviceId);
              const barber = barbers.find((item) => item.id === appointment.barberId);

              return (
                <div
                  key={appointment.id}
                  className="grid grid-cols-[140px_1fr_180px_120px] items-center border-b border-slate-100 px-5 py-4 text-sm last:border-b-0"
                >
                  <p className="font-bold text-slate-800">
                    {appointment.startTime} - {appointment.endTime}
                  </p>
                  <div>
                    <p className="font-bold text-slate-800">
                      {appointment.customerName}
                    </p>
                    <p className="text-xs font-medium text-slate-400">{barber?.name}</p>
                  </div>
                  <p className="font-medium text-slate-600">{service?.name}</p>
                  <span className="w-fit rounded-md bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                    {appointment.status}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
