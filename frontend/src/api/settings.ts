import api from "./axios";

export interface UpdateProfileData {
  username: string;
  email: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export async function updateProfile(
  data: UpdateProfileData
) {
  const response = await api.put(
    "/auth/profile",
    data
  );

  return response.data;
}

export async function changePassword(
  data: ChangePasswordData
) {
  const response = await api.put(
    "/auth/change-password",
    data
  );

  return response.data;
}