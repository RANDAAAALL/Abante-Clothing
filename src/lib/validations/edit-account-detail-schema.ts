import { z } from "zod";

export const EditAccountDetailsSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters" })
    .refine((val) => {
      if (val.includes(' ')) return false;
      if (!/^[A-Za-z0-9]+$/.test(val)) return false;
      return true;
    }, {
      message: "Username can only contain letters and numbers and cannot contain spaces"
    }),
  email: z.string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z.string().optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
})
.refine((data) => {
  // Skip validation if no passwords provided
  if (!data.password && !data.confirmPassword) return true;
  return true; // Continue to next refinements
})
.refine((data) => {
  if (data.password && data.password.length < 8) {
    return false;
  }
  return true;
}, {
  message: "Password must be at least 8 characters long.",
  path: ["password"]
})
.refine((data) => {
  if (data.password && !/[A-Z]/.test(data.password)) {
    return false;
  }
  return true;
}, {
  message: "Password must contain at least one uppercase letter.",
  path: ["password"]
})
.refine((data) => {
  if (data.password && !/[a-z]/.test(data.password)) {
    return false;
  }
  return true;
}, {
  message: "Password must contain at least one lowercase letter.",
  path: ["password"]
})
.refine((data) => {
  if (data.password && !/[0-9]/.test(data.password)) {
    return false;
  }
  return true;
}, {
  message: "Password must contain at least one number.",
  path: ["password"]
})
.refine((data) => {
  if (data.password && !/[^A-Za-z0-9]/.test(data.password)) {
    return false;
  }
  return true;
}, {
  message: "Password must contain at least one special character.",
  path: ["password"]
})
.refine((data) => {
  if (data.password && data.password.includes(' ')) {
    return false;
  }
  return true;
}, {
  message: "Password cannot contain spaces",
  path: ["password"]
})
.refine((data) => {
  // Only check password match if passwords are provided
  if ((data.password || data.confirmPassword) && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export type EditAccountDetailsFormType = z.infer<typeof EditAccountDetailsSchema>;