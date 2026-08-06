import { FolderKanban } from "lucide-react";

export default function RecentProjects() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FolderKanban className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold">
          Recent Projects
        </h2>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg border p-3">
          <p className="font-medium">
            DevTrack
          </p>

          <p className="text-sm text-slate-500">
            In Progress
          </p>
        </div>

        <div className="rounded-lg border p-3">
          <p className="font-medium">
            Portfolio Website
          </p>

          <p className="text-sm text-slate-500">
            Planning
          </p>
        </div>
      </div>
    </div>
  );
}