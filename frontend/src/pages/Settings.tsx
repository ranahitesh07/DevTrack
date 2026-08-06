import { User, Lock, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserProfile {
  id: string;
  username: string;
  email: string;
}

export default function Settings() {
  const { logout } = useAuth();

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading settings...
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">
          Settings
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your account settings.
        </p>
      </div>

      {/* Profile */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />

          <h2 className="text-xl font-semibold">
            Profile
          </h2>
        </div>

        <div className="grid gap-5">
          <div>
            <Label>Username</Label>

            <Input
              value={data?.username ?? ""}
              disabled
            />
          </div>

          <div>
            <Label>Email</Label>

            <Input
              value={data?.email ?? ""}
              disabled
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <Lock className="h-5 w-5 text-orange-500" />

          <h2 className="text-xl font-semibold">
            Security
          </h2>
        </div>

        <Button
          variant="outline"
          disabled
        >
          Coming in Sprint 6
        </Button>
      </div>

      {/* Logout */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <LogOut className="h-5 w-5 text-red-500" />

          <h2 className="text-xl font-semibold">
            Account
          </h2>
        </div>

        <Button
          variant="destructive"
          onClick={logout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}