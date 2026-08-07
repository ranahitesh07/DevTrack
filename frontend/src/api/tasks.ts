import api from "./axios";

export interface TaskCreate {
  project_id: string;
  title: string;
  description?: string;
  status?: "Todo" | "In Progress" | "Completed";
  priority?: "Low" | "Medium" | "High";
  due_date?: string | null;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: "Todo" | "In Progress" | "Completed";
  priority?: "Low" | "Medium" | "High";
  due_date?: string | null;
}

export async function getTasks() {
  const response = await api.get("/tasks");
  return response.data;
}

export async function createTask(
  task: TaskCreate
) {
  const response = await api.post(
    "/tasks",
    task
  );

  return response.data;
}

export async function updateTask(
  id: string,
  task: TaskUpdate
) {
  const response = await api.put(
    `/tasks/${id}`,
    task
  );

  return response.data;
}

export async function deleteTask(id: string) {
  await api.delete(`/tasks/${id}`);
}