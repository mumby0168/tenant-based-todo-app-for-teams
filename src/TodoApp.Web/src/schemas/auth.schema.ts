import * as yup from 'yup';

export const emailSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

export const verificationSchema = yup.object({
  code: yup
    .string()
    .matches(/^\d{6}$/, 'Code must be 6 digits')
    .required('Verification code is required'),
});

export const registrationSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Display name is required'),
  teamName: yup
    .string()
    .min(3, 'Team name must be at least 3 characters')
    .max(50, 'Team name must be less than 50 characters')
    .required('Team name is required'),
});

export type EmailFormData = yup.InferType<typeof emailSchema>;
export type VerificationFormData = yup.InferType<typeof verificationSchema>;
export type RegistrationFormData = yup.InferType<typeof registrationSchema>;