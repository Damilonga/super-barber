import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <strong className="mt-2 block text-3xl font-bold text-slate-950">
            {value}
          </strong>
        </div>
        <div className="flex size-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Icon size={20} aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-400">{hint}</p>
    </div>
  );
}
