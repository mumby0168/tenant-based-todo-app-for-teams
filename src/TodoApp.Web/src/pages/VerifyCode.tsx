import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Link,
  LinearProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth-store';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import { useVerifyCode } from '../hooks/mutations/useVerifyCode';
import { useRequestCode } from '../hooks/mutations/useRequestCode';
import { OtpInput } from '../components/OtpInput';

export function VerifyCode() {
  const navigate = useNavigate();
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const verifyCode = useVerifyCode();
  const requestCode = useRequestCode();

  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState<number>(AUTH_CONSTANTS.RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    // Redirect if no pending email
    if (!pendingEmail) {
      navigate('/login');
      return;
    }

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
  }, [pendingEmail, navigate]);

  const handleCodeComplete = (code: string) => {
    if (pendingEmail) {
      verifyCode.mutate({
        email: pendingEmail,
        code,
      });
    }
  };

  const handleResend = () => {
    if (pendingEmail) {
      setResendDisabled(true);
      setResendTimer(AUTH_CONSTANTS.RESEND_COOLDOWN_SECONDS);
      requestCode.mutate({ email: pendingEmail });
    }
  };

  if (!pendingEmail) return null;

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
            Verify Your Email
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
            We sent a code to
          </Typography>

          <Typography variant="body1" align="center" sx={{ fontWeight: 'medium', mb: 3 }}>
            {pendingEmail}
          </Typography>

          <Box>
            <Box sx={{ mb: 3 }}>
              <OtpInput
                onComplete={handleCodeComplete}
                disabled={verifyCode.isPending}
              />
            </Box>

            {(verifyCode.isError || requestCode.isError) && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {verifyCode.error?.message || requestCode.error?.message}
              </Alert>
            )}

            {/* Timer Progress Bar */}
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={100 - (resendTimer / AUTH_CONSTANTS.RESEND_COOLDOWN_SECONDS) * 100}
                sx={{ height: 4, borderRadius: 2 }}
              />
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                Code expires in {AUTH_CONSTANTS.CODE_EXPIRATION_MINUTES} minutes
              </Typography>
            </Box>

            {/* Resend Code Link */}
            <Typography variant="body2" color="text.secondary" align="center">
              Didn't receive the code?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={handleResend}
                disabled={resendDisabled || requestCode.isPending}
                sx={{
                  textDecoration: resendDisabled ? 'none' : 'underline',
                  color: resendDisabled ? 'text.disabled' : 'primary.main',
                  cursor: resendDisabled ? 'default' : 'pointer',
                }}
              >
                {resendDisabled
                  ? `Resend in ${resendTimer}s`
                  : 'Resend code'}
              </Link>
            </Typography>

            {/* Back to Login Link */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  useAuthStore.getState().clearPendingEmail();
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