import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  Crown,
  Scissors,
  ShieldCheck,
  Store,
} from "lucide-react";

const plans = [
  {
    name: "Start",
    price: "R$ 97",
    description: "Para barbearias pequenas que querem agenda online simples.",
    features: [
      "1 unidade cadastrada",
      "Ate 3 barbeiros",
      "Link publico de agendamento",
      "Cadastro de servicos",
      "Agenda diaria",
    ],
  },
  {
    name: "Pro",
    price: "R$ 197",
    description: "Para barbearias que querem operar com mais controle e imagem.",
    featured: true,
    features: [
      "Ate 8 barbeiros",
      "Personalizacao do link publico",
      "Dashboard da barbearia",
      "Controle de status da agenda",
      "Onboarding assistido",
    ],
  },
  {
    name: "Scale",
    price: "R$ 397",
    description: "Para redes ou operacoes com demanda maior.",
    features: [
      "Multiplas unidades",
      "Suporte prioritario",
      "Relatorios gerenciais",
      "Treinamento da equipe",
      "Acompanhamento mensal",
    ],
  },
];

const sellingPoints = [
  {
    icon: CalendarCheck,
    title: "Menos horario perdido",
    text: "O cliente escolhe um horario livre sem depender de troca de mensagens.",
  },
  {
    icon: Store,
    title: "Presenca digital pronta",
    text: "Cada barbearia ganha um link proprio para colocar no Instagram e WhatsApp.",
  },
  {
    icon: ShieldCheck,
    title: "Controle do dono",
    text: "Painel para acompanhar agenda, profissionais, servicos e atendimentos.",
  },
];

export default function PlansPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-slate-200 bg-[#f8fafc]">
        <div className="mx-auto max-w-6xl px-5 py-8">
          <nav className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 text-slate-950">
              <span className="flex size-9 items-center justify-center rounded-md border border-slate-200 bg-white text-xs font-bold">
                SB
              </span>
              <span className="font-bold">Super Barber</span>
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Acessar painel
            </Link>
          </nav>

          <div className="grid gap-8 py-14 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-800">
                <Crown size={16} aria-hidden="true" />
                Planos para vender para barbearias
              </div>
              <h1 className="mt-6 max-w-3xl text-5xl font-bold tracking-normal text-slate-950">
                Transforme agenda manual em venda recorrente.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                O Super Barber entrega painel da barbearia, link publico de
                agendamento e controle operacional em um modelo simples de assinatura.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/agendar/barbearia-do-joao"
                  className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Ver demo publica
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                >
                  Abrir painel
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-950">
                <BadgeCheck size={17} className="text-blue-700" aria-hidden="true" />
                Oferta sugerida
              </p>
              <p className="mt-4 text-3xl font-bold text-slate-950">Plano Pro</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Melhor ponto de partida para demonstracao: agenda, barbeiros,
                servicos, personalizacao e link publico.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-4 lg:grid-cols-3">
          {sellingPoints.map((item) => (
            <div key={item.title} className="rounded-lg border border-slate-200 p-5">
              <item.icon className="text-blue-700" size={22} aria-hidden="true" />
              <h2 className="mt-4 font-bold text-slate-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <section
              key={plan.name}
              className={`rounded-lg border p-5 ${
                plan.featured
                  ? "border-blue-300 bg-blue-50 shadow-sm"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">{plan.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {plan.description}
                  </p>
                </div>
                {plan.featured ? (
                  <span className="rounded-md bg-blue-700 px-2 py-1 text-xs font-bold text-white">
                    Melhor venda
                  </span>
                ) : null}
              </div>
              <p className="mt-6 text-4xl font-bold text-slate-950">
                {plan.price}
                <span className="text-sm font-semibold text-slate-500">/mes</span>
              </p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                  >
                    <Check size={16} className="text-blue-700" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-lg border border-slate-200 bg-slate-950 p-6 text-white">
          <div className="grid gap-6 lg:grid-cols-[1fr_260px] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-blue-200">
                <Scissors size={17} aria-hidden="true" />
                Proxima conversa com a barbearia
              </p>
              <h2 className="mt-3 text-2xl font-bold">
                Mostre o link publico antes de falar de painel.
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                A primeira venda fica mais facil quando o dono ve como o cliente final
                agenda pelo celular.
              </p>
            </div>
            <Link
              href="/agendar/barbearia-do-joao"
              className="inline-flex h-11 items-center justify-center rounded-md bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
            >
              Abrir demo
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
