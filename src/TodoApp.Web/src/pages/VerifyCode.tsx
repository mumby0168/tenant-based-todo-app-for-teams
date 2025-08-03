import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Link,
  LinearProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth-store';
import { useVerifyCode, useRequestCode } from '../hooks/mutations/useAuth';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

export function VerifyCode() {
  const navigate = useNavigate();
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const verifyCode = useVerifyCode();
  const requestCode = useRequestCode();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(AUTH_CONSTANTS.RESEND_COOLDOWN_SECONDS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Redirect if no pending email
    if (!pendingEmail && !code.some(digit => digit)) {
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

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (value && index === 5 && newCode.every(digit => digit)) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
      setCode(newCode);
      if (pastedData.length === 6) {
        handleSubmit(pastedData);
      }
    }
  };

  const handleSubmit = (codeString?: string) => {
    const finalCode = codeString || code.join('');
    if (finalCode.length === 6 && pendingEmail) {
      verifyCode.mutate({
        email: pendingEmail,
        code: finalCode,
      });
    }
  };

  const handleResend = () => {
    if (pendingEmail) {
      setResendDisabled(true);
      setResendTimer(AUTH_CONSTANTS.RESEND_COOLDOWN_SECONDS);
      requestCode.mutate({ email: pendingEmail });
      setCode(['', '', '', '', '', '']); // Clear the code
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
            {/* OTP Input Fields */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
              {code.map((digit, index) => (
                <TextField
                  key={index}
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: 'center',
                      fontSize: '24px',
                      fontWeight: '500',
                    },
                    'aria-label': `Digit ${index + 1}`,
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  sx={{
                    width: 48,
                    '& .MuiOutlinedInput-root': {
                      height: 56,
                    },
                  }}
                  disabled={verifyCode.isPending}
                  autoFocus={index === 0}
                />
              ))}
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={() => handleSubmit()}
              disabled={code.join('').length !== 6 || verifyCode.isPending}
              sx={{ mb: 2 }}
            >
              {verifyCode.isPending ? 'Verifying...' : 'Verify Code'}
            </Button>

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