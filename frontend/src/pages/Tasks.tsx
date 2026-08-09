import React, {
  useState,
} from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Task } from "@/types/task";
import PageSkeleton from "@/components/common/PageSkeleton";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  DragEndEvent,
} from "@dnd-kit/core";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DndContext,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  List,
  Columns3,
} from "lucide-react";

import {
  deleteTask,
  getTasks,
  updateTask,
} from "@/api/tasks";

import EmptyState from "@/components/common/EmptyState";
import TaskDialog from "@/components/tasks/TaskDialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function KanbanColumn({
  status,
  children,
}: {
  status:
    | "Todo"
    | "In Progress"
    | "Completed";
  children: React.ReactNode;
}) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[180px] rounded-xl border p-4 transition ${
  isOver
    ? "border-blue-400 bg-blue-50"
    : "bg-slate-50"
}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">
          {status}
        </h2>
      </div>

      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function KanbanTaskCard({
  task,
}: {
  task: Task;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-lg border bg-white p-4 shadow-sm hover:shadow-md active:cursor-grabbing"
    >
      <h3 className="font-semibold">
        {task.title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {task.description ||
          "No description"}
      </p>

      <div className="mt-3 flex gap-2">
        <Badge
          className={
            task.priority === "High"
              ? "bg-red-600 hover:bg-red-600"
              : task.priority === "Medium"
              ? "bg-yellow-500 hover:bg-yellow-500"
              : "bg-green-600 hover:bg-green-600"
          }
        >
          {task.priority}
        </Badge>
      </div>
    </div>
  );
}

export default function Tasks() {
  const queryClient = useQueryClient();

  async function handleDragEnd(
  event: DragEndEvent
) {
  const {
    active,
    over,
  } = event;

  if (!over) return;

  const taskId = String(
    active.id
  );

  const newStatus =
    String(over.id) as
      | "Todo"
      | "In Progress"
      | "Completed";

  const task = data.find(
    (task: Task) =>
      task.id === taskId
  );

  if (!task) return;

  if (task.status === newStatus) {
    return;
  }

  try {
    await updateTask(taskId, {
      status: newStatus,
    });

    queryClient.invalidateQueries({
      queryKey: ["tasks"],
    });

    queryClient.invalidateQueries({
      queryKey: ["dashboard"],
    });

    toast.success(
      `Task moved to ${newStatus}.`
    );
  } catch {
    toast.error(
      "Failed to update task status."
    );
  }
}

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

    toast.success("Task deleted successfully.");
  },

  onError: () => {
    toast.error("Failed to delete task.");
  },
});

  const [open, setOpen] = useState(false);

  const [view, setView] =
    useState<"list" | "kanban">("list");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
  useState("All");

  const [priorityFilter, setPriorityFilter] =
  useState("All");

  const [mode, setMode] = useState<
    "create" | "edit"
  >("create");

  const [selectedTask, setSelectedTask] =
    useState<Task>();

  const [deleteDialogOpen, setDeleteDialogOpen] =
  useState(false);

const [taskToDelete, setTaskToDelete] =
  useState<string | null>(null);

const filteredTasks = data.filter(
  (task: Task) => {
    const matchesSearch =
      task.title
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" ||
      task.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  }
);

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
  setTaskToDelete(id);
  setDeleteDialogOpen(true);
}

function confirmDelete() {
  if (!taskToDelete) return;

  deleteMutation.mutate(taskToDelete);

  setDeleteDialogOpen(false);
  setTaskToDelete(null);
}

if (isLoading) {
  return <PageSkeleton cards={4} />;
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

<div className="flex items-center gap-3">
  <div className="flex rounded-lg border bg-white p-1">
    <Button
      type="button"
      variant={
        view === "list"
          ? "default"
          : "ghost"
      }
      size="sm"
      className="cursor-pointer"
      onClick={() => setView("list")}
    >
      <List className="mr-2 h-4 w-4" />
      List
    </Button>

    <Button
      type="button"
      variant={
        view === "kanban"
          ? "default"
          : "ghost"
      }
      size="sm"
      className="cursor-pointer"
      onClick={() => setView("kanban")}
    >
      <Columns3 className="mr-2 h-4 w-4" />
      Kanban
    </Button>
  </div>

  <Button
    onClick={handleCreate}
    className="cursor-pointer"
  >
    <Plus className="mr-2 h-4 w-4" />
    New Task
  </Button>
</div>
      </div>

{/* Search + Filters */}
<div className="flex flex-wrap gap-4">
  <div className="relative flex-1 min-w-[250px]">
    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

    <Input
      placeholder="Search tasks..."
      className="pl-10"
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
    />
  </div>

  <Select
    value={statusFilter}
    onValueChange={(value) =>
  setStatusFilter(
    value ?? "All"
  )
}
  >
    <SelectTrigger className="w-44">
      <SelectValue placeholder="Status" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="All">
        All Status
      </SelectItem>

      <SelectItem value="Todo">
        Todo
      </SelectItem>

      <SelectItem value="In Progress">
        In Progress
      </SelectItem>

      <SelectItem value="Completed">
        Completed
      </SelectItem>
    </SelectContent>
  </Select>

  <Select
    value={priorityFilter}
    onValueChange={(value) =>
  setPriorityFilter(
    value ?? "All"
  )
}
  >
    <SelectTrigger className="w-44">
      <SelectValue placeholder="Priority" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="All">
        All Priority
      </SelectItem>

      <SelectItem value="High">
        High
      </SelectItem>

      <SelectItem value="Medium">
        Medium
      </SelectItem>

      <SelectItem value="Low">
        Low
      </SelectItem>
    </SelectContent>
  </Select>
</div>

      {/* Content */}
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
      ) : filteredTasks.length === 0 ? (
<EmptyState
  title="No Matching Tasks"
  description="Try changing your search or filters."
/>
      ) : view === "list" ? (
        <div className="space-y-4">
          {filteredTasks.map(
            (task: Task) => (
              <div
                key={task.id}
                className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
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

                    <div className="mt-3 flex gap-2">
                      <Badge
                        className={
                          task.priority ===
                          "High"
                            ? "bg-red-600 hover:bg-red-600"
                            : task.priority ===
                              "Medium"
                            ? "bg-yellow-500 hover:bg-yellow-500"
                            : "bg-green-600 hover:bg-green-600"
                        }
                      >
                        {task.priority}
                      </Badge>

                      <Badge
                        className={
                          task.status ===
                          "Completed"
                            ? "bg-green-600 hover:bg-green-600"
                            : task.status ===
                              "In Progress"
                            ? "bg-blue-600 hover:bg-blue-600"
                            : "bg-slate-600 hover:bg-slate-600"
                        }
                      >
                        {task.status}
                      </Badge>
                    </div>
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
                      disabled={
                        deleteMutation.isPending
                      }
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
<DndContext
  onDragEnd={handleDragEnd}
>
  <div className="grid gap-5 lg:grid-cols-3">
    {(
      [
        "Todo",
        "In Progress",
        "Completed",
      ] as const
    ).map((status) => {
      const statusTasks =
        filteredTasks.filter(
          (task: Task) =>
            task.status === status
        );

      return (
        <KanbanColumn
          key={status}
          status={status}
        >
          {statusTasks.map(
            (task: Task) => (
              <KanbanTaskCard
                key={task.id}
                task={task}
              />
            )
          )}

          {statusTasks.length === 0 && (
            <div className="rounded-lg border border-dashed bg-white p-8 text-center text-sm text-slate-400">
              No tasks
            </div>
          )}
        </KanbanColumn>
      );
    })}
  </div>
</DndContext>
)}

      <TaskDialog
        open={open}
        onOpenChange={setOpen}
        mode={mode}
        task={selectedTask}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Task"
        description="This action cannot be undone. This will permanently delete the task."
        onConfirm={confirmDelete}
      />
    </div>
  );
}