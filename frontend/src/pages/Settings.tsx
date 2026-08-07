import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { User, Lock, LogOut } from "lucide-react";

import { getCurrentUser } from "@/api/auth";

import {
  updateProfile,
  changePassword,
} from "@/api/settings";

import { useAuth } from "@/context/AuthContext";

import {
  profileSchema,
  passwordSchema,
  type ProfileFormData,
  type PasswordFormData,
} from "@/lib/validators/settings";

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
  const [editingProfile, setEditingProfile] =
  useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading } =
    useQuery<UserProfile>({
      queryKey: ["current-user"],
      queryFn: getCurrentUser,
    });

  const profileForm =
    useForm<ProfileFormData>({
      resolver: zodResolver(
        profileSchema
      ),
    });

  const passwordForm =
    useForm<PasswordFormData>({
      resolver: zodResolver(
        passwordSchema
      ),
    });

  useEffect(() => {
    if (!data) return;

    profileForm.reset({
      username: data.username,
      email: data.email,
    });
  }, [data, profileForm]);

  const profileMutation =
    useMutation({
      mutationFn: updateProfile,

onSuccess: () => {
  toast.success(
    "Profile updated successfully."
  );

  setEditingProfile(false);

  queryClient.invalidateQueries({
    queryKey: ["current-user"],
  });
},

      onError: (error: any) => {
        toast.error(
          error.response?.data?.detail ??
            "Failed to update profile."
        );
      },
    });

  const passwordMutation =
    useMutation({
      mutationFn: (
        data: PasswordFormData
      ) =>
        changePassword({
          current_password:
            data.current_password,
          new_password:
            data.new_password,
        }),

      onSuccess: () => {
        toast.success(
          "Password changed successfully."
        );

        passwordForm.reset();
      },

      onError: (error: any) => {
        toast.error(
          error.response?.data?.detail ??
            "Failed to change password."
        );
      },
    });

  function onProfileSubmit(
    data: ProfileFormData
  ) {
    profileMutation.mutate(data);
  }

  function onPasswordSubmit(
    data: PasswordFormData
  ) {
    passwordMutation.mutate(data);
  }

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

      <form
        onSubmit={profileForm.handleSubmit(
          onProfileSubmit
        )}
        className="space-y-6"
      >
        <div>
          <Label htmlFor="username">
            Username
          </Label>

<Input
  id="username"
  disabled={!editingProfile}
  {...profileForm.register("username")}
/>

          {profileForm.formState.errors
            .username && (
            <p className="mt-1 text-sm text-red-500">
              {
                profileForm.formState.errors
                  .username.message
              }
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email">
            Email
          </Label>

<Input
  id="email"
  type="email"
  disabled={!editingProfile}
  {...profileForm.register("email")}
/>

          {profileForm.formState.errors
            .email && (
            <p className="mt-1 text-sm text-red-500">
              {
                profileForm.formState.errors
                  .email.message
              }
            </p>
          )}
        </div>

<div className="flex justify-end gap-3">
  {!editingProfile ? (
    <Button
      type="button"
      className="cursor-pointer"
      onClick={() =>
        setEditingProfile(true)
      }
    >
      Edit Profile
    </Button>
  ) : (
    <>
      <Button
        type="button"
        variant="outline"
        className="cursor-pointer"
        onClick={() => {
          profileForm.reset({
            username: data?.username ?? "",
            email: data?.email ?? "",
          });

          setEditingProfile(false);
        }}
      >
        Cancel
      </Button>

      <Button
        type="submit"
        className="cursor-pointer"
        disabled={profileMutation.isPending}
      >
        {profileMutation.isPending
          ? "Saving..."
          : "Save Changes"}
      </Button>
    </>
  )}
</div>

</form>
</div>

{/* Security */}
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Lock className="h-5 w-5 text-orange-500" />

        <h2 className="text-xl font-semibold">
          Security
        </h2>
      </div>

      <form
        onSubmit={passwordForm.handleSubmit(
          onPasswordSubmit
        )}
        className="space-y-6"
      >
        <div>
          <Label htmlFor="current-password">
            Current Password
          </Label>

          <Input
            id="current-password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter current password"
            {...passwordForm.register(
              "current_password"
            )}
          />

          {passwordForm.formState.errors
            .current_password && (
            <p className="mt-1 text-sm text-red-500">
              {
                passwordForm.formState.errors
                  .current_password
                  .message
              }
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="new-password">
            New Password
          </Label>

          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter new password"
            {...passwordForm.register(
              "new_password"
            )}
          />

          {passwordForm.formState.errors
            .new_password && (
            <p className="mt-1 text-sm text-red-500">
              {
                passwordForm.formState.errors
                  .new_password.message
              }
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="confirm-password">
            Confirm Password
          </Label>

          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm new password"
            {...passwordForm.register(
              "confirm_password"
            )}
          />

          {passwordForm.formState.errors
            .confirm_password && (
            <p className="mt-1 text-sm text-red-500">
              {
                passwordForm.formState.errors
                  .confirm_password
                  .message
              }
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="cursor-pointer"
            disabled={
              passwordMutation.isPending
            }
          >
            {passwordMutation.isPending
              ? "Updating..."
              : "Change Password"}
          </Button>
        </div>
      </form>
    </div>

    {/* Account */}
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <LogOut className="h-5 w-5 text-red-500" />

        <h2 className="text-xl font-semibold">
          Account
        </h2>
      </div>

      <Button
        variant="destructive"
        className="cursor-pointer"
        onClick={logout}
      >
        Logout
      </Button>
    </div>
  </div>
);
}