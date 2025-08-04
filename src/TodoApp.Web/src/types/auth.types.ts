// Match backend DTOs exactly

// Request types
export interface RequestCodeRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface CompleteRegistrationRequest {
  email: string;
  code: string;
  displayName: string;
  teamName: string;
}

// Response types
export interface RequestCodeResponse {
  message: string;
}

export interface VerifyCodeResponse {
  token: string;
  isNewUser: boolean;
  user?: UserInfo;
}

export interface AuthResponse {
  token: string;
  user: UserInfo;
  team: TeamInfo;
}

// Shared types
export interface UserInfo {
  id: string;
  email: string;
  displayName: string;
}

export interface TeamInfo {
  id: string;
  name: string;
  role: string; // "Admin", "Member", etc.
}

// Error types
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  extensions?: Record<string, unknown>;
}

export interface ValidationProblemDetails extends ProblemDetails {
  errors?: Record<string, string[]>;
}