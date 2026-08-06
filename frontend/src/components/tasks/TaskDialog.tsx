import { useEffect, useState } from "react";
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

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const [projectId, setProjectId] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState<
      "Low" | "Medium" | "High"
    >("Medium");

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && task) {
      setProjectId(task.project_id);
      setTitle(task.title);
      setDescription(
        task.description ?? ""
      );
      setPriority(task.priority);
    } else {
      setProjectId("");
      setTitle("");
      setDescription("");
      setPriority("Medium");
    }
  }, [open, mode, task]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (mode === "create") {
        return createTask({
          project_id: projectId,
          title,
          description,
          priority,
        });
      }

      return updateTask(task!.id, {
        title,
        description,
        priority,
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
    },
  });

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    mutation.mutate();
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
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label>Project</Label>

            <Select
              value={projectId}
              onValueChange={
                setProjectId
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>

              <SelectContent>
                {projects.map(
                  (project: Project) => (
                    <SelectItem
                      key={project.id}
                      value={project.id}
                    >
                      {project.title}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Task Title</Label>

            <Input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="Implement Login"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>

            <Textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Describe this task..."
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>

            <Select
              value={priority}
              onValueChange={(value) =>
                setPriority(
                  value as
                    | "Low"
                    | "Medium"
                    | "High"
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