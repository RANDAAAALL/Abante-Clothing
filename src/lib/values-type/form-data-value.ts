import { FieldProps } from "@/components/ui/form-content/form";
import { forgotPasswordFormType, loginFormType, registerFormType } from "../validations/auth-schema";

export const registerFields: FieldProps<registerFormType>[] = [
    { fieldName: "username", fieldPlaceholder: "Enter your username", fieldType: "text" },
    { fieldName: "email", fieldPlaceholder: "Enter your email", fieldType: "email" },
    { fieldName: "password", fieldPlaceholder: "Enter your password", fieldType: "password" },
    { fieldName: "confirmPassword", fieldPlaceholder: "Confirm your password", fieldType: "password" },
  ];
  
  export const loginFields: FieldProps<loginFormType>[] = [
    { fieldName: "email", fieldPlaceholder: "Enter your email", fieldType: "email" },
    { fieldName: "password", fieldPlaceholder: "Enter your password", fieldType: "password" },
  ];
  
  export const forgotPasswordFields: FieldProps<forgotPasswordFormType>[] = [
    { fieldName: "email", fieldPlaceholder: "Enter your email", fieldType: "email" },
  ];
  