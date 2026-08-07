import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  taskSchema,
  type TaskFormData,
} from "@/lib/validators/task";

import { toast } from "sonner";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTask,
  updateTask,
} from "@/api/tasks";

import { getProjects } from "@/api/projects";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Project {
  id: string;
  title: string;
}

interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "In Progress" | "Completed";
  due_date?: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  task?: Task;
}

export default function TaskDialog({
  open,
  onOpenChange,
  mode,
  task,
}: Props) {
  const queryClient = useQueryClient();
  const {
  register,
  handleSubmit,
  reset,
  watch,
  setValue,
  formState: { errors },
} = useForm<TaskFormData>({
  resolver: zodResolver(taskSchema),

  defaultValues: {
    project_id: "",
    title: "",
    description: "",
    priority: "Medium",
    status: "Todo",
  },
});

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

useEffect(() => {
  if (!open) return;

  if (mode === "edit" && task) {
    reset({
      project_id: task.project_id,
      title: task.title,
      description: task.description ?? "",
      priority: task.priority,
      status: task.status,
    });
  } else {
    reset({
      project_id: "",
      title: "",
      description: "",
      priority: "Medium",
      status: "Todo",
    });
  }
}, [open, mode, task, reset]);

const projectId = watch("project_id");
const priority = watch("priority");
const status = watch("status");

const mutation = useMutation({
  mutationFn: async (
  data: TaskFormData
) => {
if (mode === "create") {
  return createTask({
    project_id: data.project_id,
    title: data.title,
    description: data.description,
    priority: data.priority,
    status: data.status,
  });
}

return updateTask(task!.id, {
  title: data.title,
  description: data.description,
  priority: data.priority,
  status: data.status,
});
  },

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["tasks"],
    });

    queryClient.invalidateQueries({
      queryKey: ["dashboard"],
    });

    onOpenChange(false);

    toast.success(
      mode === "create"
        ? "Task created successfully."
        : "Task updated successfully."
    );
  },

  onError: () => {
    toast.error(
      mode === "create"
        ? "Failed to create task."
        : "Failed to update task."
    );
  },
});

function onSubmit(
  data: TaskFormData
) {
  mutation.mutate(data);
}

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Create Task"
              : "Edit Task"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
<div className="space-y-2">
  <Label>Project</Label>

  <Select
    value={projectId}
    onValueChange={(value) =>
      setValue("project_id", value)
    }
  >
    <SelectTrigger>
      <SelectValue placeholder="Select Project" />
    </SelectTrigger>

    <SelectContent>
      {projects.map((project: Project) => (
        <SelectItem
          key={project.id}
          value={project.id}
        >
          {project.title}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

  {errors.project_id && (
    <p className="text-sm text-red-500">
      {errors.project_id.message}
    </p>
  )}
</div>

<div className="space-y-2">
  <Label>Task Title</Label>

  <Input
    placeholder="Implement Login"
    {...register("title")}
  />

  {errors.title && (
    <p className="text-sm text-red-500">
      {errors.title.message}
    </p>
  )}
</div>

<div className="space-y-2">
  <Label>Description</Label>

  <Textarea
    placeholder="Describe this task..."
    {...register("description")}
  />
</div>

<div className="space-y-2">
  <Label>Priority</Label>

  <Select
    value={priority}
    onValueChange={(value) =>
      setValue(
        "priority",
        value as "Low" | "Medium" | "High"
      )
    }
  >
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="Low">
        Low
      </SelectItem>

      <SelectItem value="Medium">
        Medium
      </SelectItem>

      <SelectItem value="High">
        High
      </SelectItem>
    </SelectContent>
  </Select>
</div>
          
<div className="space-y-2">
  <Label>Status</Label>

  <Select
    value={status}
    onValueChange={(value) =>
      setValue(
        "status",
        value as
          | "Todo"
          | "In Progress"
          | "Completed"
      )
    }
  >
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>

    <SelectContent>
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
</div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                mutation.isPending
              }
            >
              {mutation.isPending
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Create Task"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}