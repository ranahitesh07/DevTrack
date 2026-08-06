import { useState } from "react";
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
  deleteProject,
  getProjects,
} from "@/api/projects";

import EmptyState from "@/components/common/EmptyState";
import ProjectDialog from "@/components/projects/ProjectDialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
}

export default function Projects() {
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
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

  const [selectedProject, setSelectedProject] =
    useState<Project>();

  function handleCreate() {
    setMode("create");
    setSelectedProject(undefined);
    setOpen(true);
  }

  function handleEdit(project: Project) {
    setMode("edit");
    setSelectedProject(project);
    setOpen(true);
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    deleteMutation.mutate(id);
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading projects...
        </h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <h2 className="text-xl font-semibold text-red-500">
          Failed to load projects.
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
            Projects
          </h1>

          <p className="mt-2 text-slate-500">
            Manage all your development projects.
          </p>
        </div>

        <Button
          className="cursor-pointer"
          onClick={handleCreate}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

          <Input
            placeholder="Search projects..."
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

      {/* Content */}
      {data.length === 0 ? (
        <EmptyState
          title="No Projects Yet"
          description="Create your first project to start tracking your work."
          action={
            <Button
              className="cursor-pointer"
              onClick={handleCreate}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {data.map((project: Project) => (
            <div
              key={project.id}
              className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {project.title}
                  </h2>

                  <p className="mt-3 text-sm text-slate-500">
                    {project.description ||
                      "No description"}
                  </p>
                </div>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  {project.status}
                </span>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleEdit(project)
                  }
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    handleDelete(project.id)
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
          ))}
        </div>
      )}

      <ProjectDialog
        open={open}
        onOpenChange={setOpen}
        mode={mode}
        project={selectedProject}
      />
    </div>
  );
}