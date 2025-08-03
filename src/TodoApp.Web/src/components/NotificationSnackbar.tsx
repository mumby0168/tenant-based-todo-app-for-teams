import { Snackbar, Alert } from '@mui/material';
import { useUiStore } from '../stores/ui-store';

export function NotificationSnackbar() {
  const { notifications, removeNotification } = useUiStore();
  
  // Show the most recent notification
  const notification = notifications[notifications.length - 1];

  if (!notification) return null;

  return (
    <Snackbar
      open={true}
      autoHideDuration={5000}
      onClose={() => removeNotification(notification.id)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={() => removeNotification(notification.id)}
        severity={notification.severity}
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
}