import { CalendarCheck, DollarSign, Store, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { requireRole } from "@/lib/auth/guards";
import { getAppointmentCount, getBarbershops } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireRole("super_admin");

  const [barbershops, appointmentCount] = await Promise.all([
    getBarbershops(),
    getAppointmentCount(),
  ]);
  const activeShops = barbershops.filter((shop) => shop.status === "ativa").length;
  const estimatedRevenue = activeShops * 149;

  return (
    <AppShell
      area="admin"
      title="Dashboard"
      eyebrow="Visao geral da plataforma"
      activeLabel="Dashboard"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Barbearias"
          value={String(barbershops.length)}
          hint="Clientes cadastrados na plataforma"
          icon={Store}
        />
        <StatCard
          label="Ativas"
          value={String(activeShops)}
          hint="Operando e recebendo agendamentos"
          icon={Users}
        />
        <StatCard
          label="Agendamentos"
          value={String(appointmentCount)}
          hint="Total registrado na plataforma"
          icon={CalendarCheck}
        />
        <StatCard
          label="MRR estimado"
          value={`R$ ${estimatedRevenue}`}
          hint="Baseado em plano medio de R$ 149"
          icon={DollarSign}
        />
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-950">Barbearias recentes</h2>
        </div>
        <div className="grid grid-cols-[1.2fr_1fr_120px_120px] border-b border-slate-100 px-5 py-3 text-sm font-bold text-slate-500">
          <span>Barbearia</span>
          <span>Email</span>
          <span>Plano</span>
          <span>Status</span>
        </div>
        <div>
          {barbershops.map((shop) => (
            <div
              key={shop.id}
              className="grid grid-cols-[1.2fr_1fr_120px_120px] items-center border-b border-slate-100 px-5 py-4 text-sm last:border-b-0"
            >
              <div>
                <p className="font-bold text-slate-800">{shop.name}</p>
                <p className="text-xs font-medium text-slate-400">{shop.ownerName}</p>
              </div>
              <p className="text-slate-600">{shop.email}</p>
              <p className="font-medium text-slate-600">{shop.plan}</p>
              <span className="w-fit rounded-md bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                {shop.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
