import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarDays,
  Crown,
  DollarSign,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Scissors,
  Settings,
  Store,
  Users,
} from "lucide-react";
import { logout } from "@/lib/auth/actions";
import { getBarbershopForUser } from "@/lib/auth/barbershop-context";
import { getCurrentUser } from "@/lib/auth/session";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const adminItems: NavItem[] = [
  { href: "/admin/barbearias", label: "Super Admin", icon: Crown },
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard", label: "Relatorios", icon: BarChart3 },
  { href: "/planos", label: "Planos", icon: DollarSign },
];

const shopItems: NavItem[] = [
  { href: "/barbearia/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/barbearia/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/barbearia/barbeiros", label: "Barbeiros", icon: Users },
  { href: "/barbearia/servicos", label: "Servicos", icon: Scissors },
  { href: "/barbearia/configuracoes", label: "Configuracoes", icon: Settings },
];

type AppShellProps = {
  area: "admin" | "barbearia";
  title: string;
  eyebrow: string;
  activeLabel?: string;
  children: React.ReactNode;
};

function getInitials(name?: string) {
  return (name ?? "SB")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export async function AppShell({
  area,
  title,
  eyebrow,
  activeLabel,
  children,
}: AppShellProps) {
  const items = area === "admin" ? adminItems : shopItems;
  const user = await getCurrentUser();
  const shop = user ? await getBarbershopForUser(user) : null;
  const userName = user?.fullName ?? "Super Barber";
  const userEmail = user?.email ?? "";
  const shopName = area === "admin" ? "Administracao" : shop?.name ?? "Barbearia";
  const bookingHref = shop?.slug ? `/agendar/${shop.slug}` : "/planos";

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="px-4 py-5">
          <Link href="/" className="flex items-center gap-3 px-2">
            <span className="flex size-9 items-center justify-center rounded-md bg-white text-xs font-bold text-slate-950 ring-1 ring-slate-200">
              SB
            </span>
            <span>
              <strong className="block text-lg font-semibold text-slate-950">
                Super Barber
              </strong>
              <span className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                <Store size={13} aria-hidden="true" />
                {shopName}
              </span>
            </span>
          </Link>

        <nav className="mt-9 space-y-2">
          {items.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                activeLabel === item.label
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              <item.icon size={18} aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
        </div>

        <div className="mt-auto border-t border-slate-100 px-4 py-4">
          <Link
            href={bookingHref}
            className="mb-5 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
          >
            <ExternalLink size={16} aria-hidden="true" />
            {shop?.slug ? "Link de agendamento" : "Pagina de planos"}
          </Link>
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {getInitials(userName)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {userName}
                </p>
                <p className="truncate text-xs text-slate-500">{userEmail}</p>
              </div>
            </div>
            <form action={logout}>
              <button
                type="submit"
                aria-label="Sair"
                className="text-slate-400 transition hover:text-slate-700"
              >
                <LogOut size={16} aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="lg:pl-64">
        <header className="bg-[#f8fafc]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-8 py-8">
            <div>
              <h1 className="text-3xl font-bold tracking-normal text-slate-950">
                {title}
              </h1>
              <p className="mt-1 text-sm font-semibold text-slate-500">{eyebrow}</p>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-8 pb-8">{children}</div>
      </main>
    </div>
  );
}
