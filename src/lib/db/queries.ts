import { getSql } from "@/lib/db/client";
import type {
  Appointment,
  AvailableHour,
  Barber,
  Barbershop,
  Service,
} from "@/types";

type BarbershopRow = {
  id: string;
  name: string;
  slug: string;
  owner_name: string;
  email: string;
  phone: string;
  address: string | null;
  public_intro: string | null;
  plan: string;
  status: Barbershop["status"];
  primary_color: string;
  onboarding_completed: boolean;
};

type BarberRow = {
  id: string;
  barbershop_id: string;
  name: string;
  phone: string | null;
  specialties: string[];
  status: Barber["status"];
};

type ServiceRow = {
  id: string;
  barbershop_id: string;
  name: string;
  description: string | null;
  price: string;
  duration_minutes: number;
  status: Service["status"];
};

type AppointmentRow = {
  id: string;
  barbershop_id: string;
  barber_id: string;
  service_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: Appointment["status"];
  value: string;
};

type AvailableHourRow = {
  id: string;
  barbershop_id: string;
  barber_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  interval_minutes: number;
  active: boolean;
};

function mapBarbershop(row: BarbershopRow): Barbershop {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    ownerName: row.owner_name,
    email: row.email,
    phone: row.phone,
    address: row.address ?? "",
    publicIntro: row.public_intro ?? "",
    plan: row.plan,
    status: row.status,
    primaryColor: row.primary_color,
    onboardingCompleted: row.onboarding_completed,
  };
}

function mapBarber(row: BarberRow): Barber {
  return {
    id: row.id,
    barbershopId: row.barbershop_id,
    name: row.name,
    phone: row.phone ?? "",
    specialties: row.specialties,
    status: row.status,
  };
}

function mapService(row: ServiceRow): Service {
  return {
    id: row.id,
    barbershopId: row.barbershop_id,
    name: row.name,
    description: row.description ?? "",
    price: Number(row.price),
    durationMinutes: row.duration_minutes,
    status: row.status,
  };
}

function mapAppointment(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    barbershopId: row.barbershop_id,
    barberId: row.barber_id,
    serviceId: row.service_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email ?? "",
    date: row.appointment_date,
    startTime: row.start_time.slice(0, 5),
    endTime: row.end_time.slice(0, 5),
    status: row.status,
    value: Number(row.value),
  };
}

function mapAvailableHour(row: AvailableHourRow): AvailableHour {
  return {
    id: row.id,
    barbershopId: row.barbershop_id,
    barberId: row.barber_id,
    weekday: row.weekday,
    startTime: row.start_time.slice(0, 5),
    endTime: row.end_time.slice(0, 5),
    intervalMinutes: row.interval_minutes,
    active: row.active,
  };
}

export async function getBarbershops(): Promise<Barbershop[]> {
  const sql = getSql();
  const rows = (await sql`
    select
      id,
      name,
      slug,
      owner_name,
      email,
      phone,
      address,
      public_intro,
      plan,
      status,
      primary_color,
      onboarding_completed
    from public.barbershops
    order by created_at desc
  `) as BarbershopRow[];

  return rows.map(mapBarbershop);
}

export async function getBarbershopBySlug(slug: string): Promise<Barbershop | null> {
  const sql = getSql();
  const rows = (await sql`
    select
      id,
      name,
      slug,
      owner_name,
      email,
      phone,
      address,
      public_intro,
      plan,
      status,
      primary_color,
      onboarding_completed
    from public.barbershops
    where slug = ${slug}
    limit 1
  `) as BarbershopRow[];

  return rows[0] ? mapBarbershop(rows[0]) : null;
}

export async function getBarbershopById(id: string): Promise<Barbershop | null> {
  const sql = getSql();
  const rows = (await sql`
    select
      id,
      name,
      slug,
      owner_name,
      email,
      phone,
      address,
      public_intro,
      plan,
      status,
      primary_color,
      onboarding_completed
    from public.barbershops
    where id = ${id}
    limit 1
  `) as BarbershopRow[];

  return rows[0] ? mapBarbershop(rows[0]) : null;
}

export async function getDefaultBarbershop(): Promise<Barbershop | null> {
  const sql = getSql();
  const rows = (await sql`
    select
      id,
      name,
      slug,
      owner_name,
      email,
      phone,
      address,
      public_intro,
      plan,
      status,
      primary_color,
      onboarding_completed
    from public.barbershops
    order by created_at asc
    limit 1
  `) as BarbershopRow[];

  return rows[0] ? mapBarbershop(rows[0]) : null;
}

export async function getBarbersByBarbershopId(
  barbershopId: string,
): Promise<Barber[]> {
  const sql = getSql();
  const rows = (await sql`
    select id, barbershop_id, name, phone, specialties, status
    from public.barbers
    where barbershop_id = ${barbershopId}
    order by name asc
  `) as BarberRow[];

  return rows.map(mapBarber);
}

export async function getServicesByBarbershopId(
  barbershopId: string,
): Promise<Service[]> {
  const sql = getSql();
  const rows = (await sql`
    select id, barbershop_id, name, description, price, duration_minutes, status
    from public.services
    where barbershop_id = ${barbershopId}
    order by name asc
  `) as ServiceRow[];

  return rows.map(mapService);
}

export async function getAppointmentsByBarbershopId(
  barbershopId: string,
): Promise<Appointment[]> {
  const sql = getSql();
  const rows = (await sql`
    select
      id,
      barbershop_id,
      barber_id,
      service_id,
      customer_name,
      customer_phone,
      customer_email,
      appointment_date::text as appointment_date,
      start_time::text as start_time,
      end_time::text as end_time,
      status,
      value
    from public.appointments
    where barbershop_id = ${barbershopId}
    order by appointment_date asc, start_time asc
  `) as AppointmentRow[];

  return rows.map(mapAppointment);
}

export async function getAvailableHoursByBarbershopId(
  barbershopId: string,
): Promise<AvailableHour[]> {
  const sql = getSql();
  const rows = (await sql`
    select
      id,
      barbershop_id,
      barber_id,
      weekday,
      start_time::text as start_time,
      end_time::text as end_time,
      interval_minutes,
      active
    from public.available_hours
    where barbershop_id = ${barbershopId}
      and active = true
    order by weekday asc, start_time asc
  `) as AvailableHourRow[];

  return rows.map(mapAvailableHour);
}

export async function getAppointmentCount(): Promise<number> {
  const sql = getSql();
  const rows = (await sql`
    select count(*)::int as count
    from public.appointments
  `) as { count: number }[];

  return rows[0]?.count ?? 0;
}
