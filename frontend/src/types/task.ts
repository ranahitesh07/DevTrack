export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;

  status:
    | "Todo"
    | "In Progress"
    | "Completed";

  priority:
    | "Low"
    | "Medium"
    | "High";

  due_date?: string | null;
}