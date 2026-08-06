import { useQuery } from "@tanstack/react-query";
import {
  FolderKanban,
  CheckSquare,
  CircleCheckBig,
  Clock,
} from "lucide-react";

import { getDashboardStats } from "@/api/dashboard";

import StatCard from "@/components/dashboard/StatCard";
import RecentProjects from "@/components/dashboard/RecentProjects";
import UpcomingTasks from "@/components/dashboard/UpcomingTasks";

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Welcome back! Here's your productivity overview.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Projects"
          value={data.total_projects}
          icon={FolderKanban}
          color="bg-blue-600"
        />

        <StatCard
          title="Tasks"
          value={data.total_tasks}
          icon={CheckSquare}
          color="bg-violet-600"
        />

        <StatCard
          title="Completed"
          value={data.completed_tasks}
          icon={CircleCheckBig}
          color="bg-green-600"
        />

        <StatCard
          title="Pending"
          value={data.pending_tasks}
          icon={Clock}
          color="bg-orange-500"
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