import { z } from "zod";

export const EditAccountDetailsSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters" })
  .refine((val) => {
    if (val.includes(' ')) return false;
    if (!/^[A-Za-z0-9]+$/.test(val)) return false;
    return true;
  }, {
    message: "Username can only contain letters and numbers and cannot contain spaces"
  })
,
    email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format"),

    // password: z.string()
    // .min(8, { message: "Password must be at least 8 characters long." })
    // .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    // .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    // .regex(/[0-9]/, { message: "Password must contain at least one number." })
    // .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." })
    // .refine((val) => !val.includes(' '), {
    // message: "Password cannot contain spaces"
    // })
    // confirmPassword: z.string(),
    // })
    // .refine((data) => data.password === data.confirmPassword, {
    //     message: "Password do not match",
    //     path: ['confirmPassword']
})

export type EditAccountDetailsFormType = z.infer<typeof EditAccountDetailsSchema>