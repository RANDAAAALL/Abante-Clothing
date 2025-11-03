import { FieldProps } from "@/components/ui/form/form-content";
import { forgotPasswordFormType, loginFormType, registerFormType, resetPasswordFormType } from "../validations/auth-schema";
import { uploadProductFieldsType } from "../validations/upload-product-schema";
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
  
  export const resetPasswordFields: FieldProps<resetPasswordFormType>[] = [
    { fieldName: "password", fieldPlaceholder: "Enter your new password", fieldType: "password" },
    { fieldName: "confirmPassword", fieldPlaceholder: "Confirm your password", fieldType: "password" },
  ];