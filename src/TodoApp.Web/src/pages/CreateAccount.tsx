import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../stores/auth-store';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import { useCompleteRegistration } from '../hooks/mutations/useCompleteRegistration';
import { useNavigateWhenUnauthenticated } from '../hooks/navigation/useNavigateWhenUnauthenticated';

// Validation schema matching backend requirements
const createAccountSchema = yup.object({
  displayName: yup
    .string()
    .required('Display name is required')
    .min(AUTH_CONSTANTS.NAME_MIN_LENGTH, `Must be at least ${AUTH_CONSTANTS.NAME_MIN_LENGTH} characters`)
    .max(AUTH_CONSTANTS.NAME_MAX_LENGTH, `Must not exceed ${AUTH_CONSTANTS.NAME_MAX_LENGTH} characters`),
  teamName: yup
    .string()
    .required('Team name is required')
    .min(3, 'Team name must be at least 3 characters')
    .max(50, 'Team name must not exceed 50 characters'),
});

type CreateAccountFormData = yup.InferType<typeof createAccountSchema>;

export function CreateAccount() {
  const { pendingEmail, pendingCode } = useAuthStore();
  const completeRegistration = useCompleteRegistration();

  const form = useForm<CreateAccountFormData>({
    resolver: yupResolver(createAccountSchema),
    mode: 'onChange',
    defaultValues: {
      displayName: '',
      teamName: '',
    },
  });

  useNavigateWhenUnauthenticated();

  const onSubmit = (data: CreateAccountFormData) => {
    if (!pendingEmail || !pendingCode) return;

    completeRegistration.mutate({
      email: pendingEmail,
      code: pendingCode,
      displayName: data.displayName,
      teamName: data.teamName,
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Create Your Account
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" gutterBottom sx={{ mb: 3 }}>
            Let's set up your account and first team
          </Typography>

          <Box component="form" onSubmit={form.handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Controller
              name="displayName"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Display Name"
                  placeholder="John Doe"
                  autoComplete="name"
                  autoFocus
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || 'This is how you\'ll appear to your team'}
                  disabled={completeRegistration.isPending}
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Controller
              name="teamName"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Team Name"
                  placeholder="My Team"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || 'You can invite others to this team later'}
                  disabled={completeRegistration.isPending}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!form.formState.isValid || completeRegistration.isPending}
            >
              {completeRegistration.isPending ? 'Creating Account...' : 'Create Account'}
            </Button>

            {completeRegistration.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {completeRegistration.error?.message || 'Failed to create account'}
              </Alert>
            )}

            <Typography variant="body2" color="text.secondary" align="center">
              By creating an account, you'll become the admin of your team
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}