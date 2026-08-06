import { Plus, Search, Filter } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Tasks() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Tasks
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your project tasks.
          </p>
        </div>

        <Button className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

          <Input
            placeholder="Search tasks..."
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

      {/* Empty State */}
      <EmptyState
        title="No Tasks Yet"
        description="Create your first task to start tracking your progress."
        action={
          <Button className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        }
      />
    </div>
  );
}