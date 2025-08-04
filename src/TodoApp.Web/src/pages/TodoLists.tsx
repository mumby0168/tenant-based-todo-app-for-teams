import { Add as AddIcon, FormatListBulleted as FormatListBulletedIcon } from '@mui/icons-material';
import { Box, Fab, Typography } from '@mui/material';
import { useTodoLists } from '../hooks/queries/useTodoLists';

/**
 * TodoLists page component - Slice 1 implementation
 * 
 * React Performance Notes:
 * - Uses React Query hook which automatically handles:
 *   - Loading states
 *   - Error states  
 *   - Caching and background updates
 *   - Preventing unnecessary re-renders
 */
export function TodoLists() {
  const { data: todoListsResponse, isLoading, error } = useTodoLists();

  // Show loading state
  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Todo Lists
        </Typography>
        <Typography>Loading your lists...</Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Todo Lists
        </Typography>
        <Typography color="error">
          Failed to load lists: {error.message}
        </Typography>
      </Box>
    );
  }

  const todoLists = todoListsResponse?.todoLists || [];

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom>
        Todo Lists
      </Typography>

      {/* Empty State - Slice 1 Focus */}
      {todoLists.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
          }}
        >
          <FormatListBulletedIcon 
            sx={{ 
              fontSize: 64, 
              color: 'text.secondary', 
              mb: 2 
            }} 
          />
          <Typography variant="h5" color="text.primary" gutterBottom>
            No lists yet!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Create your first todo list to get started with your team
          </Typography>
        </Box>
      )}

      {/* FAB for creating lists - positioned bottom-right */}
      <Fab
        color="primary"
        aria-label="create list"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => {
          // TODO: Open create drawer in Slice 2
          console.log('Create list clicked - will implement in Slice 2');
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}