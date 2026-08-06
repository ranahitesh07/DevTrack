import { CheckSquare } from "lucide-react";

export default function UpcomingTasks() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <CheckSquare className="h-5 w-5 text-green-600" />

        <h2 className="text-xl font-semibold">
          Upcoming Tasks
        </h2>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg border p-3">
          <p className="font-medium">
            Finish Dashboard UI
          </p>

          <p className="text-sm text-slate-500">
            Due Tomorrow
          </p>
        </div>

        <div className="rounded-lg border p-3">
          <p className="font-medium">
            Build Projects Page
          </p>

          <p className="text-sm text-slate-500">
            High Priority
          </p>
        </div>
      </div>
    </div>
  );
}