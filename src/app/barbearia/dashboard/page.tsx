import { CalendarDays, DollarSign, Scissors, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { getBarbershopForUser } from "@/lib/auth/barbershop-context";
import { requireUser } from "@/lib/auth/guards";
import { requireCompletedOnboarding } from "@/lib/auth/onboarding-guard";
import {
  getAppointmentsByBarbershopId,
  getBarbersByBarbershopId,
  getServicesByBarbershopId,
} from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function BarbershopDashboardPage() {
  const user = await requireUser();
  const shop = await getBarbershopForUser(user);

  requireCompletedOnboarding(user, shop);

  if (!shop) {
    return (
      <AppShell
        area="barbearia"
        title="Dashboard"
        eyebrow="Nenhuma barbearia cadastrada"
        activeLabel="Dashboard"
      >
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Cadastre uma barbearia no Super Admin para visualizar este painel.
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
  const todayAppointments = appointments.filter(
    (appointment) => appointment.date === "2026-05-08",
  );
  const todayRevenue = todayAppointments
    .filter((appointment) => appointment.status === "atendido")
    .reduce((total, appointment) => total + appointment.value, 0);

  return (
    <AppShell
      area="barbearia"
      title="Dashboard"
      eyebrow={shop.name}
      activeLabel="Dashboard"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Hoje"
          value={String(todayAppointments.length)}
          hint="Agendamentos para o dia"
          icon={CalendarDays}
        />
        <StatCard
          label="Barbeiros"
          value={String(barbers.length)}
          hint="Profissionais ativos"
          icon={Users}
        />
        <StatCard
          label="Servicos"
          value={String(services.length)}
          hint="Disponiveis no link publico"
          icon={Scissors}
        />
        <StatCard
          label="Faturado hoje"
          value={`R$ ${todayRevenue}`}
          hint="Atendimentos concluidos"
          icon={DollarSign}
        />
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-950">Proximos atendimentos</h2>
        </div>
        <div className="grid grid-cols-[120px_1fr_160px_120px] border-b border-slate-100 px-5 py-3 text-sm font-bold text-slate-500">
          <span>Horario</span>
          <span>Cliente</span>
          <span>Valor</span>
          <span>Status</span>
        </div>
        <div>
          {todayAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="grid grid-cols-[120px_1fr_160px_120px] items-center border-b border-slate-100 px-5 py-4 text-sm last:border-b-0"
            >
              <p className="font-bold text-slate-800">{appointment.startTime}</p>
              <div>
                <p className="font-bold text-slate-800">{appointment.customerName}</p>
                <p className="text-xs font-medium text-slate-400">
                  {appointment.customerPhone}
                </p>
              </div>
              <p className="font-medium text-slate-600">R$ {appointment.value}</p>
              <span className="w-fit rounded-md bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                {appointment.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
