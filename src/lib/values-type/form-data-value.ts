import { FieldProps } from "@/components/ui/form-content/form";
import { RegisterFormType } from "../types/form-data-types";

export const registerFields: FieldProps<RegisterFormType>[] = [
    { fieldName: "username", fieldPlaceholder: "Enter your username", fieldType: "text" },
    { fieldName: "email", fieldPlaceholder: "Enter your email", fieldType: "email" },
    { fieldName: "password", fieldPlaceholder: "Enter your password", fieldType: "password" },
    { fieldName: "confirmPassword", fieldPlaceholder: "Confirm your password", fieldType: "password" },
  ];
  
  export const loginFields = [
    { fieldName: "email", fieldPlaceholder: "Enter your email", fieldType: "email" },
    { fieldName: "password", fieldPlaceholder: "Enter your password", fieldType: "password" },
  ];
  
  export const forgotPasswordFields = [
    { fieldName: "email", fieldPlaceholder: "Enter your email", fieldType: "email" },
  ];
  