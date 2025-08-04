import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  Link,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { emailSchema, type EmailFormData } from '../schemas/auth.schema';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import { useRequestCode } from '../hooks/mutations/useRequestCode';

export function Login() {
  const requestCode = useRequestCode();

  const form = useForm<EmailFormData>({
    resolver: yupResolver(emailSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: EmailFormData) => {
    requestCode.mutate(data);
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
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            TodoApp V1
          </Typography>

          <Typography variant="body1" color="text.secondary" align="center" gutterBottom>
            Sign in to continue to TodoApp
          </Typography>

          <Box component="form" onSubmit={form.handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email Address"
                  autoComplete="email"
                  autoFocus
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={requestCode.isPending}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!form.formState.isValid || requestCode.isPending}
            >
              {requestCode.isPending ? 'Sending...' : 'Continue'}
            </Button>

            {requestCode.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {requestCode.error?.message || 'Failed to send verification code'}
              </Alert>
            )}

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              We'll send you a {AUTH_CONSTANTS.VERIFICATION_CODE_LENGTH}-digit code to sign in
            </Typography>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                New user?{' '}
                <Link
                  href="/signup"
                  underline="hover"
                  sx={{ cursor: 'pointer' }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}