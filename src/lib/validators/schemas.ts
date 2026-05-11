import { z } from "zod";

export const emailSchema = z.string().email("Informe um e-mail valido");

export const phoneSchema = z
  .string()
  .min(10, "Informe um telefone valido")
  .regex(/^[0-9()\-\s+]+$/, "Use apenas numeros e formatacao de telefone");

export const slugSchema = z
  .string()
  .min(3, "O slug precisa ter ao menos 3 caracteres")
  .regex(/^[a-z0-9-]+$/, "Use letras minusculas, numeros e hifens");

export const barbershopSchema = z.object({
  name: z.string().min(2, "Informe o nome da barbearia"),
  ownerName: z.string().min(2, "Informe o responsavel"),
  email: emailSchema,
  phone: phoneSchema,
  plan: z.string().min(2, "Informe o plano"),
  address: z.string().optional(),
});

export const updateBarbershopSchema = barbershopSchema.extend({
  barbershopId: z.string().uuid("Barbearia invalida"),
  status: z.enum(["ativa", "inativa", "bloqueada"]),
});

export const serviceSchema = z.object({
  barbershopId: z.string().uuid("Barbearia invalida"),
  name: z.string().min(2, "Informe o nome do servico"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Informe um preco positivo"),
  durationMinutes: z.coerce.number().int().positive("Informe uma duracao valida"),
});

export const barberSchema = z.object({
  barbershopId: z.string().uuid("Barbearia invalida"),
  name: z.string().min(2, "Informe o nome do barbeiro"),
  phone: phoneSchema.optional().or(z.literal("")),
  specialties: z.string().optional(),
});

export const updateBarberSchema = barberSchema.extend({
  barberId: z.string().uuid("Barbeiro invalido"),
  status: z.enum(["ativo", "inativo"]),
});

export const appointmentSchema = z.object({
  barbershopId: z.string().uuid("Barbearia invalida"),
  barberId: z.string().uuid("Escolha um barbeiro"),
  serviceId: z.string().uuid("Escolha um servico"),
  customerName: z.string().min(2, "Informe seu nome"),
  customerPhone: phoneSchema,
  customerEmail: emailSchema.optional().or(z.literal("")),
  appointmentDate: z.string().min(10, "Escolha uma data"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Escolha um horario"),
});

export const updateAppointmentStatusSchema = z.object({
  appointmentId: z.string().uuid("Agendamento invalido"),
  barbershopId: z.string().uuid("Barbearia invalida"),
  status: z.enum(["agendado", "confirmado", "atendido", "cancelado", "ausente"]),
});

export const firstAccessPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "A senha precisa ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "Use pelo menos uma letra maiuscula")
      .regex(/[a-z]/, "Use pelo menos uma letra minuscula")
      .regex(/[0-9]/, "Use pelo menos um numero"),
    confirmPassword: z.string().min(1, "Confirme a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas nao conferem",
    path: ["confirmPassword"],
  });

export const onboardingSchema = z.object({
  barbershopId: z.string().uuid("Barbearia invalida"),
  name: z.string().min(2, "Informe o nome publico da barbearia"),
  phone: phoneSchema,
  address: z.string().min(3, "Informe o endereco"),
  publicIntro: z.string().min(10, "Escreva uma apresentacao curta"),
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Informe uma cor valida"),
});

export const updateServiceSchema = serviceSchema.extend({
  serviceId: z.string().uuid("Servico invalido"),
  status: z.enum(["ativo", "inativo"]),
});
