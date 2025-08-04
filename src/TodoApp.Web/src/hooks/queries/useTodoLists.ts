import { useQuery } from "@tanstack/react-query";
import { todoListsApi } from "../../apis/todo-lists.api";
import { useAuthStore } from "../../stores/auth-store";

// Query keys for cache management
const todoListsKeys = {
  all: ['todoLists'] as const,
  lists: () => [...todoListsKeys.all, 'list'] as const,
};

/**
 * React Query hook for fetching todo lists
 * 
 * Performance considerations:
 * - Uses React Query for intelligent caching and background updates
 * - Only fetches when user is authenticated (enabled: !!token)
 * - Automatically refetches on window focus for fresh data
 * - Provides loading, error, and success states out of the box
 */
export function useTodoLists() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: todoListsKeys.lists(),
    queryFn: () => todoListsApi.getTodoLists(),
    enabled: !!token, // Only run query when user is authenticated
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}

// Export query keys for manual cache operations if needed
export { todoListsKeys };