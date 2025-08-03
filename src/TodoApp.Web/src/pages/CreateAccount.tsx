import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registrationSchema, type RegistrationFormData } from '../schemas/auth.schema';
import { useRegister } from '../hooks/mutations/useAuth';

export function CreateAccount() {
  const navigate = useNavigate();
  const register = useRegister();
  const [email, setEmail] = useState('');

  const form = useForm<RegistrationFormData>({
    resolver: yupResolver(registrationSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      teamName: '',
    },
  });

  useEffect(() => {
    // Get email from session storage
    const storedEmail = sessionStorage.getItem('auth_email');
    if (!storedEmail) {
      navigate('/login');
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const onSubmit = (data: RegistrationFormData) => {
    register.mutate({
      email,
      ...data,
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
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Create Your Account
          </Typography>
          
          <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
            Let's set up your profile and first team
          </Typography>

          <Box component="form" onSubmit={form.handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Display Name"
                  autoComplete="name"
                  autoFocus
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || 'This is how you\'ll appear to your team'}
                  disabled={register.isPending}
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
                  autoComplete="organization"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || 'You can invite others to this team later'}
                  disabled={register.isPending}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!form.formState.isValid || register.isPending}
            >
              {register.isPending ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Typography variant="caption" color="text.secondary" align="center" display="block">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}