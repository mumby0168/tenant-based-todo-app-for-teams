import { useRef, useState } from 'react';
import { Box, TextField } from '@mui/material';

interface OtpInputProps {
  length?: number;
  onComplete: (code: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function OtpInput({
  length = 6,
  onComplete,
  disabled = false,
  autoFocus = true
}: OtpInputProps) {
  const [code, setCode] = useState(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (value && index === length - 1 && newCode.every(digit => digit)) {
      onComplete(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split('').concat(Array(length).fill('')).slice(0, length);
      setCode(newCode);
      if (pastedData.length === length) {
        onComplete(pastedData);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
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
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
        />
      ))}
    </Box>
  );
}

// Export utility function for external code clearing
OtpInput.displayName = 'OtpInput';