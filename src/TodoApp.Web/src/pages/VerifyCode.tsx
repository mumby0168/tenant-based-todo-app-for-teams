import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Link,
  LinearProgress,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { verificationSchema, type VerificationFormData } from '../schemas/auth.schema';
import { useVerifyCode, useRequestCode } from '../hooks/mutations/useAuth';

export function VerifyCode() {
  const navigate = useNavigate();
  const verifyCode = useVerifyCode();
  const requestCode = useRequestCode();
  
  const [email, setEmail] = useState('');
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(60);
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<VerificationFormData>({
    resolver: yupResolver(verificationSchema),
    mode: 'onChange',
    defaultValues: {
      code: '',
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

    // Start resend timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const onSubmit = (data: VerificationFormData) => {
    verifyCode.mutate({
      email,
      code: data.code,
    });
  };

  const handleResend = () => {
    setResendDisabled(true);
    setResendTimer(60);
    requestCode.mutate({ email });
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
            Verify Your Email
          </Typography>
          
          <Typography variant="body2" align="center" gutterBottom>
            We sent a code to
          </Typography>
          
          <Typography variant="body1" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
            {email}
          </Typography>

          <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Verification Code"
                  placeholder="000000"
                  autoComplete="one-time-code"
                  autoFocus
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || 'Enter the 6-digit code'}
                  disabled={verifyCode.isPending}
                  inputProps={{
                    maxLength: 6,
                    pattern: '[0-9]*',
                    inputMode: 'numeric',
                  }}
                />
              )}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={verifyCode.isPending}
                />
              }
              label="Remember me"
              sx={{ mt: 1 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!form.formState.isValid || verifyCode.isPending}
            >
              {verifyCode.isPending ? 'Verifying...' : 'Verify Code'}
            </Button>

            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={(15 * 60 - (60 - resendTimer)) / (15 * 60) * 100}
                sx={{ height: 6, borderRadius: 3 }}
              />
              <Typography variant="caption" color="text.secondary">
                Code expires in 15 minutes
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  handleResend();
                }}
                disabled={resendDisabled || requestCode.isPending}
                sx={{ 
                  textDecoration: resendDisabled ? 'none' : 'underline',
                  color: resendDisabled ? 'text.disabled' : 'primary.main',
                  cursor: resendDisabled ? 'default' : 'pointer',
                }}
              >
                {resendDisabled 
                  ? `Resend code in ${resendTimer}s` 
                  : 'Resend code'}
              </Link>
            </Box>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  sessionStorage.removeItem('auth_email');
                  navigate('/login');
                }}
              >
                Use a different email
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}