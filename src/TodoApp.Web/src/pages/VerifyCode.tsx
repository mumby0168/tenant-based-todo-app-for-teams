import { useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Link,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth-store';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import { useVerifyCode } from '../hooks/mutations/useVerifyCode';
import { useRequestCode } from '../hooks/mutations/useRequestCode';
import { OtpInput } from '../components/OtpInput';
import { ResendTimer } from '../components/ResendTimer';

export function VerifyCode() {
  const navigate = useNavigate();
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const verifyCode = useVerifyCode();
  const requestCode = useRequestCode();

  useEffect(() => {
    // Redirect if no pending email
    if (!pendingEmail) {
      navigate('/login');
    }
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

            <ResendTimer
              cooldownSeconds={AUTH_CONSTANTS.RESEND_COOLDOWN_SECONDS}
              codeExpirationMinutes={AUTH_CONSTANTS.CODE_EXPIRATION_MINUTES}
              onResend={handleResend}
              disabled={requestCode.isPending}
            />

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