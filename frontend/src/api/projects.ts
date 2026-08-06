import api from "./axios";

export interface ProjectCreate {
  title: string;
  description?: string;
}

export interface ProjectUpdate {
  title?: string;
  description?: string;
  status?: string;
}

export async function getProjects() {
  const response = await api.get("/projects");
  return response.data;
}

export async function createProject(
  project: ProjectCreate
) {
  const response = await api.post(
    "/projects",
    project
  );

  return response.data;
}

export async function updateProject(
  id: string,
  project: ProjectUpdate
) {
  const response = await api.put(
    `/projects/${id}`,
    project
  );

  return response.data;
}

export async function deleteProject(id: string) {
  await api.delete(`/projects/${id}`);
}