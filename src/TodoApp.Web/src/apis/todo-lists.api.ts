import { apiClient } from '../lib/api-client';
import type { ProblemDetails, TodoListsResponse } from '../types/todo-lists.types';

// Helper to extract error message from backend response
function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: ProblemDetails } };
    if (axiosError.response?.data) {
      const problemDetails = axiosError.response.data;
      return problemDetails.detail || problemDetails.title || defaultMessage;
    }
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message || defaultMessage;
  }
  return defaultMessage;
}

// API functions
export const todoListsApi = {
  async getTodoLists(): Promise<TodoListsResponse> {
    try {
      const response = await apiClient.get('/lists');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch todo lists'));
    }
  },
};