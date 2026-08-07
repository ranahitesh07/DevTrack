import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  projectSchema,
  type ProjectFormData,
} from "@/lib/validators/project";

import { toast } from "sonner";
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
  const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<ProjectFormData>({
  resolver: zodResolver(projectSchema),
  defaultValues: {
    title: "",
    description: "",
  },
});

useEffect(() => {
  if (!open) return;

  if (mode === "edit" && project) {
    reset({
      title: project.title,
      description: project.description ?? "",
    });
  } else {
    reset({
      title: "",
      description: "",
    });
  }
}, [open, mode, project, reset]);

const mutation = useMutation({
  mutationFn: async (data: ProjectFormData) => {
    if (mode === "create") {
      return createProject({
        title: data.title,
        description: data.description,
      });
    }

    return updateProject(project!.id, {
      title: data.title,
      description: data.description,
    });
  },

onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: ["projects"],
  });

  queryClient.invalidateQueries({
    queryKey: ["dashboard"],
  });

  toast.success(
    mode === "create"
      ? "Project created successfully."
      : "Project updated successfully."
  );

  onOpenChange(false);
},

onError: () => {
  toast.error(
    mode === "create"
      ? "Failed to create project."
      : "Failed to update project."
  );
},
  });

function onSubmit(
  data: ProjectFormData
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
              ? "Create Project"
              : "Edit Project"}
          </DialogTitle>
        </DialogHeader>

<form
  onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="title">
              Project Title
            </Label>

<Input
  id="title"
  placeholder="DevTrack"
  {...register("title")}
/>

{errors.title && (
  <p className="text-sm text-red-500">
    {errors.title.message}
  </p>
)}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description
            </Label>

<Textarea
  id="description"
  placeholder="Describe your project..."
  {...register("description")}
/>

{errors.description && (
  <p className="text-sm text-red-500">
    {errors.description.message}
  </p>
)}
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