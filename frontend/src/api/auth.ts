import api from "./axios";

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export async function login(data: LoginData) {
  const formData = new URLSearchParams();
  formData.append("username", data.username);
  formData.append("password", data.password);

  const response = await api.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
}

export async function register(data: RegisterData) {
  const response = await api.post("/auth/register", data);
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data;
}