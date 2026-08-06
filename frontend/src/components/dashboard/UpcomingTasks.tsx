import { CheckSquare } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function UpcomingTasks() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <CheckSquare className="h-5 w-5 text-green-600" />

        <h2 className="text-xl font-semibold">
          Upcoming Tasks
        </h2>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
        <h3 className="text-lg font-semibold">
          No Upcoming Tasks
        </h3>

        <p className="mt-2 max-w-xs text-sm text-slate-500">
          Tasks with upcoming deadlines will appear here.
        </p>

        <Button className="mt-6 cursor-pointer">
          Create Task
        </Button>
      </div>
    </div>
  );
}