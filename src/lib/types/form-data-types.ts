import { z } from 'zod'
import { forgotPasswordSchema, loginSchema, registerationSchema } from '../data-access-layer/validations/auth-schema'

export type RegisterFormType = z.infer<typeof registerationSchema>
export type LoginFormType = z.infer<typeof loginSchema>
export type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>

// form-types.ts
// type RegisterFormType = {
//   username: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// };

// type LoginFormType = {
//   email: string;
//   password: string;
// };

// type ForgotPasswordFormType = {
//   email: string;
// };

// export type { RegisterFormType, LoginFormType, ForgotPasswordFormType };