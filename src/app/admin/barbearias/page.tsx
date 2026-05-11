import { Search, Store } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { requireRole } from "@/lib/auth/guards";
import { getBarbershops } from "@/lib/db/queries";
import { BarbershopRowActions } from "./barbershop-row-actions";
import { CreateBarbershopForm } from "./create-barbershop-form";

export const dynamic = "force-dynamic";

export default async function AdminBarbershopsPage() {
  await requireRole("super_admin");

  const barbershops = await getBarbershops();

  return (
    <AppShell
      area="admin"
      title="Super Admin"
      eyebrow={`${barbershops.length} barbearias cadastradas`}
      activeLabel="Super Admin"
    >
      <CreateBarbershopForm />

      <label className="relative block">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
          size={20}
          aria-hidden="true"
        />
        <input
          placeholder="Buscar barbearias..."
          className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-700 shadow-sm placeholder:text-slate-400"
        />
      </label>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_120px_300px] border-b border-slate-100 bg-white px-5 py-3 text-sm font-bold text-slate-500">
          <span>Barbearia</span>
          <span>Email</span>
          <span>Telefone</span>
          <span>Status</span>
          <span>Acoes</span>
        </div>
        {barbershops.map((shop) => (
          <div
            key={shop.id}
            className="grid grid-cols-[1.4fr_1fr_1fr_120px_300px] items-center border-b border-slate-100 px-5 py-4 text-sm last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Store size={17} aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold text-slate-800">{shop.name}</p>
                <p className="text-xs font-medium text-slate-400">{shop.slug}</p>
              </div>
            </div>
            <span className="text-slate-600">{shop.email}</span>
            <span className="text-slate-600">{shop.phone}</span>
            <span
              className={`w-fit rounded-md px-3 py-1 text-xs font-bold ring-1 ${
                shop.status === "ativa"
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                  : shop.status === "bloqueada"
                    ? "bg-red-50 text-red-700 ring-red-100"
                    : "bg-slate-100 text-slate-500 ring-slate-200"
              }`}
            >
              {shop.status}
            </span>
            <BarbershopRowActions shop={shop} />
          </div>
        ))}
      </section>
    </AppShell>
  );
}
