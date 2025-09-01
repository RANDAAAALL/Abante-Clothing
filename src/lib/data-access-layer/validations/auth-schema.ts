import { z } from "zod"

// this is re-usable authentications form client side or server side
const passwordSchema = z.string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." });

export const registerationSchema = z.object({
    username: z.string()
    .min(2, { message: "Username must be at least 3 characters long"})
    .regex(/^[A-Za-z0-9]+$/, { message: "Username must not contain special characters"}),
    email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format"),
    password: passwordSchema,
    confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password do no match",
        path: ['confirmPassword']
    })

export const loginSchema = z.object({
    email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid Email"),
    password: z.string().trim().min(1, "Password is required"),
    })

export const forgotPasswordSchema = z.object({
    email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid Email"),
}) 





    
    