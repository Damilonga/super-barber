import Link from "next/link";
import { Clock3, MapPin, Phone, Scissors, ShieldCheck, Star } from "lucide-react";
import {
  getAppointmentsByBarbershopId,
  getAvailableHoursByBarbershopId,
  getBarbersByBarbershopId,
  getBarbershopBySlug,
  getServicesByBarbershopId,
} from "@/lib/db/queries";
import { BookingForm } from "./booking-form";

export const dynamic = "force-dynamic";

type PublicBookingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicBookingPage({ params }: PublicBookingPageProps) {
  const { slug } = await params;
  const shop = await getBarbershopBySlug(slug);

  if (!shop) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-5">
        <section className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950">Barbearia nao encontrada</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Confira se o link de agendamento esta correto.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white"
          >
            Voltar
          </Link>
        </section>
      </main>
    );
  }

  const [shopBarbers, shopServices, availableHours, appointments] = await Promise.all([
    getBarbersByBarbershopId(shop.id),
    getServicesByBarbershopId(shop.id),
    getAvailableHoursByBarbershopId(shop.id),
    getAppointmentsByBarbershopId(shop.id),
  ]);

  const activeBarbers = shopBarbers.filter((barber) => barber.status === "ativo");
  const activeServices = shopServices.filter((service) => service.status === "ativo");
  const activeAppointments = appointments.filter(
    (appointment) =>
      appointment.status !== "cancelado" && appointment.status !== "ausente",
  );
  const featuredServices = activeServices.slice(0, 3);
  const accentColor = shop.primaryColor || "#2563eb";

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 lg:grid-cols-[1fr_380px] lg:items-end">
          <div>
            <Link href="/" className="text-sm font-bold text-blue-700">
              Super Barber
            </Link>
            <div className="mt-8 flex items-center gap-4">
              <span
                className="flex size-16 shrink-0 items-center justify-center rounded-lg text-xl font-bold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {shop.name
                  .split(" ")
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join("")}
              </span>
              <div>
                <p className="text-sm font-bold text-blue-700">Agendamento online</p>
                <h1 className="mt-1 text-4xl font-bold tracking-normal text-slate-950">
                  {shop.name}
                </h1>
              </div>
            </div>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              {shop.publicIntro ||
                "Escolha seu servico, profissional e horario em poucos cliques."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
              {shop.address ? (
                <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2">
                  <MapPin size={16} aria-hidden="true" />
                  {shop.address}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2">
                <Phone size={16} aria-hidden="true" />
                {shop.phone}
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2">
                <ShieldCheck size={16} aria-hidden="true" />
                Confirmacao imediata
              </span>
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-slate-950">
              <Star size={17} className="text-blue-700" aria-hidden="true" />
              Servicos mais procurados
            </p>
            <div className="mt-4 space-y-3">
              {featuredServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-3 text-sm shadow-sm"
                >
                  <span className="font-bold text-slate-800">{service.name}</span>
                  <span className="font-semibold text-slate-500">
                    R$ {service.price} · {service.durationMinutes} min
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4">
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-950">
                <Scissors size={16} className="text-blue-700" aria-hidden="true" />
                Profissionais
              </h2>
              <div className="mt-4 space-y-3">
                {activeBarbers.map((barber) => (
                  <div key={barber.id} className="rounded-md bg-slate-50 p-3">
                    <p className="font-bold text-slate-800">{barber.name}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {barber.specialties.join(", ") || "Atendimento geral"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-950">
                <Clock3 size={16} className="text-blue-700" aria-hidden="true" />
                Como funciona
              </h2>
              <ol className="mt-4 space-y-3 text-sm font-medium text-slate-600">
                <li>1. Escolha barbeiro e servico.</li>
                <li>2. Selecione um horario livre.</li>
                <li>3. Confirme seus dados.</li>
              </ol>
            </section>
          </aside>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-medium text-blue-700">Agendamento online</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                Escolha seu melhor horario
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Os horarios ocupados somem automaticamente da agenda.
              </p>
            </div>

            <BookingForm
              shop={shop}
              barbers={activeBarbers}
              services={activeServices}
              availableHours={availableHours}
              appointments={activeAppointments}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
