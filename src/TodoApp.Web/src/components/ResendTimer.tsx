import { useEffect, useState } from 'react';
import { Box, LinearProgress, Typography, Link } from '@mui/material';

interface ResendTimerProps {
  cooldownSeconds: number;
  codeExpirationMinutes: number;
  onResend: () => void;
  disabled?: boolean;
}

export function ResendTimer({
  cooldownSeconds,
  codeExpirationMinutes,
  onResend,
  disabled = false
}: ResendTimerProps) {
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState<number>(cooldownSeconds);

  useEffect(() => {
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
  }, []);

  const handleResend = () => {
    setResendDisabled(true);
    setResendTimer(cooldownSeconds);
    onResend();
  };

  return (
    <>

      {/* Resend Code Link */}
      <Typography sx={{ mb: 2 }} variant="body2" color="text.secondary" align="center">
        Didn't receive the code?{' '}
      </Typography>

      {/* Timer Progress Bar */}
      <Box>
        <LinearProgress
          variant="determinate"
          value={100 - (resendTimer / cooldownSeconds) * 100}
          sx={{ height: 4, borderRadius: 2 }}
        />
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Link
          align='center'
          component="button"
          variant="body2"
          onClick={handleResend}
          disabled={resendDisabled || disabled}
          sx={{
            textDecoration: resendDisabled || disabled ? 'none' : 'underline',
            color: resendDisabled || disabled ? 'text.disabled' : 'primary.main',
            cursor: resendDisabled || disabled ? 'default' : 'pointer',
          }}
        >
          {resendDisabled
            ? `Resend in ${resendTimer}s`
            : 'Resend code'}
        </Link>

      </Box>

      <Typography align='center' variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
        Code expires in {codeExpirationMinutes} minutes
      </Typography>
    </>
  );
}

ResendTimer.displayName = 'ResendTimer';