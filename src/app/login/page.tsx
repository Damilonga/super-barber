import { LockKeyhole } from "lucide-react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-slate-950 text-white">
            <LockKeyhole size={18} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-slate-950">Entrar</h1>
            <p className="text-sm text-slate-500">Acesse o Super Barber</p>
          </div>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
