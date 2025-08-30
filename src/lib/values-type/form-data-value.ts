import { FieldProps } from "@/components/ui/form-content/form";
import { ForgotPasswordFormType, LoginFormType, RegisterFormType } from "../types/form-data-types";

export const registerFields: FieldProps<RegisterFormType>[] = [
    { fieldName: "username", fieldPlaceholder: "Enter your username", fieldType: "text" },
    { fieldName: "email", fieldPlaceholder: "Enter your email", fieldType: "email" },
    { fieldName: "password", fieldPlaceholder: "Enter your password", fieldType: "password" },
    { fieldName: "confirmPassword", fieldPlaceholder: "Confirm your password", fieldType: "password" },
  ];
  
  export const loginFields: FieldProps<LoginFormType>[] = [
    { fieldName: "email", fieldPlaceholder: "Enter your email", fieldType: "email" },
    { fieldName: "password", fieldPlaceholder: "Enter your password", fieldType: "password" },
  ];
  
  export const forgotPasswordFields: FieldProps<ForgotPasswordFormType>[] = [
    { fieldName: "email", fieldPlaceholder: "Enter your email", fieldType: "email" },
  ];
  