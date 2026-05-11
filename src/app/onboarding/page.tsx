import { redirect } from "next/navigation";
import { Store } from "lucide-react";
import { getBarbershopForUser } from "@/lib/auth/barbershop-context";
import { requireUser } from "@/lib/auth/guards";
import { OnboardingForm } from "./onboarding-form";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await requireUser();

  if (user.firstAccess) {
    redirect("/primeiro-acesso");
  }

  const shop = await getBarbershopForUser(user);

  if (!shop) {
    redirect("/login");
  }

  if (shop.onboardingCompleted) {
    redirect("/barbearia/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-blue-600 text-white">
            <Store size={18} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-950">Configure sua barbearia</h1>
            <p className="text-sm font-medium text-slate-500">
              Esses dados aparecem no painel e no link publico.
            </p>
          </div>
        </div>

        <OnboardingForm shop={shop} />
      </section>
    </main>
  );
}
