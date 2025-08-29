// form-types.ts
type RegisterFormType = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type LoginFormType = {
  email: string;
  password: string;
};

type ForgotPasswordFormType = {
  email: string;
};


export type { RegisterFormType, LoginFormType, ForgotPasswordFormType };