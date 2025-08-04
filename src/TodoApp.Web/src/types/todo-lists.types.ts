// Match backend DTOs exactly

// Response types
export interface TodoListDto {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  todoCount: number;
}

export interface TodoListsResponse {
  todoLists: TodoListDto[];
}

// Error types (shared with auth)
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
}