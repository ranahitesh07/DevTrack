import { useState } from "react";
import type { Task } from "@/types/task";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  deleteTask,
  getTasks,
} from "@/api/tasks";

import EmptyState from "@/components/common/EmptyState";
import TaskDialog from "@/components/tasks/TaskDialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Tasks() {
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });

  const [open, setOpen] = useState(false);

  const [mode, setMode] = useState<
    "create" | "edit"
  >("create");

  const [selectedTask, setSelectedTask] =
    useState<Task>();

  function handleCreate() {
    setMode("create");
    setSelectedTask(undefined);
    setOpen(true);
  }

  function handleEdit(task: Task) {
    setMode("edit");
    setSelectedTask(task);
    setOpen(true);
  }

  function handleDelete(id: string) {
    if (
      !window.confirm(
        "Are you sure you want to delete this task?"
      )
    ) {
      return;
    }

    deleteMutation.mutate(id);
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading tasks...
        </h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <h2 className="text-xl font-semibold text-red-500">
          Failed to load tasks.
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Tasks
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your project tasks.
          </p>
        </div>

        <Button
          onClick={handleCreate}
          className="cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Search */}

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

          <Input
            placeholder="Search tasks..."
            className="pl-10"
          />
        </div>

        <Button
          variant="outline"
          className="cursor-pointer"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Empty State */}

      {data.length === 0 ? (
        <EmptyState
          title="No Tasks Yet"
          description="Create your first task to start tracking your progress."
          action={
            <Button
              onClick={handleCreate}
              className="cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {data.map((task: Task) => (
            <div
              key={task.id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {task.title}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {task.description ||
                      "No description"}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Priority: {task.priority}
                  </p>

                  <p className="text-xs text-slate-400">
                    Status: {task.status}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleEdit(task)
                    }
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      handleDelete(task.id)
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskDialog
        open={open}
        onOpenChange={setOpen}
        mode={mode}
        task={selectedTask}
      />
    </div>
  );
}