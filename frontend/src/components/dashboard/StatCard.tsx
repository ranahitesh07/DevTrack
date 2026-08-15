import type { LucideIcon } from "lucide-react";

import { Progress } from "@/components/ui/progress";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;

  progress?: number;
  footer?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  progress,
  footer,
}: StatCardProps) {
  return (
    <div
      className="
        rounded-xl border border-slate-200 bg-white p-5
        shadow-sm
        transition-all duration-200 ease-out
        hover:-translate-y-0.5 hover:shadow-md
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>

          {progress !== undefined && (
            <div className="mt-4 space-y-2">
              <Progress value={progress} />

              {footer && (
                <p className="text-xs text-slate-500">
                  {footer}
                </p>
              )}
            </div>
          )}
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-lg ${color}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}