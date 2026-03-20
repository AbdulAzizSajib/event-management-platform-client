import { z } from 'zod';

export const loginZodSchema = z.object({
    email: z.email({ message: 'Please enter a valid email address' }),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;

export const signupZodSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email({ message: 'Please enter a valid email address' }),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type ISignupPayload = z.infer<typeof signupZodSchema>;

export const verifyEmailZodSchema = z.object({
    email: z.email({ message: 'Please enter a valid email address' }),
    otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
});

export type IVerifyEmailPayload = z.infer<typeof verifyEmailZodSchema>;
