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
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
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
          className={`rounded-xl p-4 ${color}`}
        >
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
    </div>
  );
}