export type UserRole = "super_admin" | "barbearia_admin";

export type AppointmentStatus =
  | "agendado"
  | "confirmado"
  | "atendido"
  | "cancelado"
  | "ausente";

export type BarbershopStatus = "ativa" | "inativa" | "bloqueada";

export type Barbershop = {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  email: string;
  phone: string;
  plan: string;
  status: BarbershopStatus;
  primaryColor: string;
  onboardingCompleted: boolean;
};

export type Barber = {
  id: string;
  barbershopId: string;
  name: string;
  phone: string;
  specialties: string[];
  status: "ativo" | "inativo";
};

export type Service = {
  id: string;
  barbershopId: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  status: "ativo" | "inativo";
};

export type Appointment = {
  id: string;
  barbershopId: string;
  barberId: string;
  serviceId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  value: number;
};

export type AvailableHour = {
  id: string;
  barbershopId: string;
  barberId: string;
  weekday: number;
  startTime: string;
  endTime: string;
  intervalMinutes: number;
  active: boolean;
};
