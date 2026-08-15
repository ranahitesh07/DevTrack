import { useQuery } from "@tanstack/react-query";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import {
  FolderKanban,
  CheckSquare,
  CircleCheckBig,
  Clock,
  Activity,
  TrendingUp,
} from "lucide-react";

import { getDashboardStats } from "@/api/dashboard";

import StatCard from "@/components/dashboard/StatCard";
import RecentProjects from "@/components/dashboard/RecentProjects";
import UpcomingTasks from "@/components/dashboard/UpcomingTasks";

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
  });

if (isLoading) {
  return <DashboardSkeleton />;
}

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <h2 className="text-xl font-semibold text-red-500">
          Failed to load dashboard.
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Your Workspace
        </h1>

        <p className="mt-2 max-w-2xl text-slate-500">
          A quick overview of your projects, tasks, and productivity.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Projects"
          value={data?.total_projects ?? 0}
          icon={FolderKanban}
          color="bg-slate-100 text-slate-700"
        />

        <StatCard
          title="Tasks"
          value={data?.total_tasks ?? 0}
          icon={CheckSquare}
          color="bg-slate-100 text-slate-700"
        />

        <StatCard
          title="Completed"
          value={data?.completed_tasks ?? 0}
          icon={CircleCheckBig}
          color="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="In Progress"
          value={data?.in_progress_tasks ?? 0}
          icon={Clock}
          color="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Active Projects"
          value={data?.active_projects ?? 0}
          icon={Activity}
          color="bg-slate-100 text-slate-700"
        />

        <StatCard
          title="Completion"
          value={`${data?.completion_percentage ?? 0}%`}
          icon={TrendingUp}
          color="bg-emerald-50 text-emerald-600"
          progress={data?.completion_percentage ?? 0}
          footer={`${data?.completed_tasks ?? 0} of ${
            data?.total_tasks ?? 0
          } Tasks Completed`}
        />
      </div>

      {/* Recent Projects & Upcoming Tasks */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentProjects />
        <UpcomingTasks />
      </div>
    </div>
  );
}