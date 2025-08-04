// Auth constants matching backend where applicable

export const AUTH_CONSTANTS = {
  // API endpoints
  API_BASE: '/auth',
  REQUEST_CODE_ENDPOINT: '/auth/request-code',
  VERIFY_CODE_ENDPOINT: '/auth/verify-code',
  COMPLETE_REGISTRATION_ENDPOINT: '/auth/complete-registration',
  
  // Validation
  VERIFICATION_CODE_LENGTH: 6,
  VERIFICATION_CODE_PATTERN: /^\d{6}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  
  // Timing
  CODE_EXPIRATION_MINUTES: 15,
  RESEND_COOLDOWN_SECONDS: 60,
  
  // Rate limiting
  RATE_LIMIT_MAX_REQUESTS: 3,
  RATE_LIMIT_WINDOW_HOURS: 1,
  
  // Messages
  VERIFICATION_CODE_SENT: 'Verification code sent to your email',
  INVALID_EMAIL: 'Please provide a valid email address',
  INVALID_CODE: 'The verification code is invalid or has expired',
  TOO_MANY_REQUESTS: "You've requested too many codes. Please try again later.",
  ACCOUNT_EXISTS: 'An account with this email already exists',
  
  // Storage keys
  AUTH_TOKEN_KEY: 'auth_token',
  PENDING_EMAIL_KEY: 'pending_email',
  
  // Roles
  ADMIN_ROLE: 'Admin',
  MEMBER_ROLE: 'Member',
} as const;