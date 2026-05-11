import { KeyRound } from "lucide-react";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/guards";
import { FirstAccessForm } from "./first-access-form";

export const dynamic = "force-dynamic";

export default async function FirstAccessPage() {
  const user = await requireUser();

  if (!user.firstAccess) {
    redirect(user.role === "super_admin" ? "/admin/barbearias" : "/barbearia/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-blue-600 text-white">
            <KeyRound size={18} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-950">Primeiro acesso</h1>
            <p className="text-sm font-medium text-slate-500">{user.email}</p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-slate-600">
          Seu acesso foi criado com uma senha temporaria. Crie sua senha pessoal
          para continuar usando o painel da barbearia.
        </p>

        <FirstAccessForm />
      </section>
    </main>
  );
}
