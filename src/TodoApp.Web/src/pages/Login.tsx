import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { emailSchema, type EmailFormData } from '../schemas/auth.schema';
import { useRequestCode } from '../hooks/mutations/useAuth';

export function Login() {
  const navigate = useNavigate();
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
            TodoApp
          </Typography>
          
          <Typography component="h2" variant="h6" align="center" gutterBottom>
            Sign in to your account
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
              {requestCode.isPending ? 'Sending...' : 'Send Verification Code'}
            </Button>

            <Typography variant="body2" color="text.secondary" align="center">
              We'll send you a verification code to sign in
            </Typography>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/signup');
                }}
              >
                New user? Sign up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}