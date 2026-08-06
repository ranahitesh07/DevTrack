import { useEffect, useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProject,
  updateProject,
} from "@/api/projects";

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

interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  project?: Project;
}

export default function ProjectDialog({
  open,
  onOpenChange,
  mode,
  project,
}: Props) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && project) {
      setTitle(project.title);
      setDescription(project.description ?? "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [open, mode, project]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (mode === "create") {
        return createProject({
          title,
          description,
        });
      }

      return updateProject(project!.id, {
        title,
        description,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      setTitle("");
      setDescription("");

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
              ? "Create Project"
              : "Edit Project"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="title">
              Project Title
            </Label>

            <Input
              id="title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="DevTrack"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description
            </Label>

            <Textarea
              id="description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe your project..."
            />
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
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Create Project"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}