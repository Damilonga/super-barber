import Link from "next/link";
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

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-5 py-8">
        <Link href="/" className="text-sm font-medium text-blue-700">
          Super Barber
        </Link>

        <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-5 border-b border-slate-200 pb-5">
            <div>
              <p className="text-sm font-medium text-blue-700">Agendamento online</p>
              <h1 className="mt-1 text-3xl font-semibold text-slate-950">
                {shop.name}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Escolha seu servico, profissional e horario.
              </p>
            </div>
            <span
              className="flex size-14 items-center justify-center rounded-md text-lg font-bold text-white"
              style={{ backgroundColor: shop.primaryColor }}
            >
              SB
            </span>
          </div>

          <BookingForm
            shop={shop}
            barbers={activeBarbers}
            services={activeServices}
            availableHours={availableHours}
            appointments={activeAppointments}
          />
        </div>
      </section>
    </main>
  );
}
