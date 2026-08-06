import { useQuery } from "@tanstack/react-query";
import { FolderKanban } from "lucide-react";

import { getProjects } from "@/api/projects";

interface Project {
  id: string;
  title: string;
  status: string;
}

export default function RecentProjects() {
  const {
    data = [],
    isLoading,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const projects = [...data]
    .reverse()
    .slice(0, 5);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FolderKanban className="h-5 w-5 text-blue-600" />

        <h2 className="text-xl font-semibold">
          Recent Projects
        </h2>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">
          Loading...
        </p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-slate-500">
          No recent projects.
        </p>
      ) : (
        <div className="space-y-3">
          {projects.map(
            (project: Project) => (
              <div
                key={project.id}
                className="rounded-lg border p-3"
              >
                <p className="font-medium">
                  {project.title}
                </p>

                <p className="text-sm text-slate-500">
                  {project.status}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}