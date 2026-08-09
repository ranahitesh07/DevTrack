import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import PageSkeleton from "@/components/common/PageSkeleton";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

    toast.success("Project deleted successfully.");
  },

  onError: () => {
    toast.error("Failed to delete project.");
  },
});

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [mode, setMode] = useState<
    "create" | "edit"
  >("create");

const [selectedProject, setSelectedProject] =
  useState<Project>();

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [projectToDelete, setProjectToDelete] =
    useState<string | null>(null);

  const filteredProjects = data.filter(
    (project: Project) => {
      const matchesSearch =
        project.title
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        project.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

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
  setProjectToDelete(id);
  setDeleteDialogOpen(true);
}

function confirmDelete() {
  if (!projectToDelete) return;

  deleteMutation.mutate(projectToDelete);

  setDeleteDialogOpen(false);
  setProjectToDelete(null);
}

if (isLoading) {
  return <PageSkeleton cards={4} />;
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

      {/* Search + Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

          <Input
            placeholder="Search projects..."
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
          <SelectTrigger className="w-48">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue />
            </div>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="All">
              All Projects
            </SelectItem>

            <SelectItem value="Active">
              Active
            </SelectItem>

            <SelectItem value="Completed">
              Completed
            </SelectItem>
          </SelectContent>
        </Select>
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
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          title="No Matching Projects"
          description={
            search
              ? `No project found matching "${search}".`
              : `No ${statusFilter.toLowerCase()} projects found.`
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredProjects.map(
            (project: Project) => (
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

<Badge
  className={
    project.status === "Completed"
      ? "bg-green-600 hover:bg-green-600"
      : "bg-blue-600 hover:bg-blue-600"
  }
>
  {project.status}
</Badge>
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
            )
          )}
        </div>
      )}

<ProjectDialog
  open={open}
  onOpenChange={setOpen}
  mode={mode}
  project={selectedProject}
/>

<ConfirmDialog
  open={deleteDialogOpen}
  onOpenChange={setDeleteDialogOpen}
  title="Delete Project"
  description="This action cannot be undone. This will permanently delete the project."
  onConfirm={confirmDelete}
/>
    </div>
  );
}