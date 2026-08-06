import { useQuery } from "@tanstack/react-query";
import { CheckSquare } from "lucide-react";

import { getTasks } from "@/api/tasks";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date?: string | null;
}

export default function UpcomingTasks() {
  const {
    data = [],
    isLoading,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const tasks = [...data].slice(0, 5);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <CheckSquare className="h-5 w-5 text-green-600" />

        <h2 className="text-xl font-semibold">
          Upcoming Tasks
        </h2>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">
          Loading...
        </p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-slate-500">
          No upcoming tasks.
        </p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task: Task) => (
            <div
              key={task.id}
              className="rounded-lg border p-3"
            >
              <p className="font-medium">
                {task.title}
              </p>

              <p className="text-sm text-slate-500">
                {task.priority} • {task.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}