"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  Path,
  Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import EyeOpen from "@/components/icons/svg/eye-open";
import EyeClosed from "@/components/icons/svg/eye-closed";

// Limit schemas to a Zod object (record of fields)
type AnyZodObject = z.ZodObject<Record<string, z.ZodTypeAny>>;

// RHF wants FieldValues and intersect to satisfy constraints
type RHFValues<TSchema extends AnyZodObject> = z.infer<TSchema> & FieldValues;

export type FieldProps<TValues extends FieldValues> = {
  fieldName: Path<TValues>;        
  fieldPlaceholder: string;
  fieldType?: string;
};

type FormsContentProps<TSchema extends AnyZodObject> = {
  title: string;
  description?: string;
  fields: FieldProps<RHFValues<TSchema>>[];
  onSubmitAction: SubmitHandler<RHFValues<TSchema>>;
  buttonText: string;
  labelForm?: string;
  footerDescription?: string;
  footerHref?: string;
  onResetRefAction?: (reset: () => void) => void;
  schema: TSchema;
};

export default function FormsContent<TSchema extends AnyZodObject>({
  title,
  description,
  fields,
  onSubmitAction,
  buttonText,
  labelForm,
  footerDescription,
  footerHref,
  onResetRefAction,
  schema,
}: FormsContentProps<TSchema>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<RHFValues<TSchema>>({
    resolver: zodResolver(schema) as unknown as Resolver<RHFValues<TSchema>>,
  });
  const [ showPassword, setShowPassword] = useState<boolean>(false);
  const [ showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  useEffect(() => {
    onResetRefAction?.(() => reset());
  }, [reset, onResetRefAction]);


  return (
    <div className="min-h-[500] md:min-h-screen flex items-center justify-center mx-auto md:max-w-lg">
      <form onSubmit={handleSubmit(onSubmitAction)}
        className="text-black shadow-md p-6 md:p-9 py-8 rounded-xl bg-card-white-background w-full ">

        {/* title and description  */}
        <div className="text-center">
          <span className="font-bold text-xl">{title}</span>
        </div>
        <p className="font-regular text-sm mt-1 mb-5">{description}</p>

        {/* labels and input */}
        {fields.map((field, i) => (
          <div key={i} className="font-regular flex flex-col">
            <label htmlFor={String(field.fieldName)} className="text-left text-md ml-1 mb-1 capitalize font-bold">
            {String(field.fieldName).replace(/([A-Z])/g, " $1")}
            </label>

            {/* input and toggle password visibility container */}
            <div className="relative flex">
            <input disabled={isSubmitting}
              id={String(field.fieldName)}
              className={"w-full text-sm border border-t-1 border-input-background focus:outline-none mb-4 rounded-sm p-3 px-4 pr-10"}
              {...register(field.fieldName)}
              placeholder={field.fieldPlaceholder}
              type={ field.fieldName === "password"
                  ? (showPassword ? "text" : "password")
                  : field.fieldName === "confirmPassword"
                  ? (showConfirmPassword ? "text" : "password")
                  : (field.fieldType || "text")
              }
              name={field.fieldName} 
              autoComplete={
                  field.fieldName === "email"
                  ? "email"
                  : field.fieldName === "password"
                  ? "new-password"
                  : "on"}/>

                {field.fieldName === "password" && (
                  <div className="absolute right-3 top-3 cursor-pointer" 
                  onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOpen /> : <EyeClosed />}
                  </div>
                )}

                {field.fieldName === "confirmPassword" && (
                  <div className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOpen /> : <EyeClosed />}
                  </div>
                )}
              </div>

            {/* error messages  */}
            {errors[field.fieldName]?.message && (
              <span className="text-red-600 text-sm text-left -mt-3 ml-1 mb-2">
                {errors[field.fieldName]?.message as string ??
                  "This field is required"}
              </span>
            )}
          </div>
        ))}

        {/* label form for forgotpassword */}
        {labelForm && (
          <div className="text-sm mb-1">
            {labelForm === "Forgot Password?" ? (
              <Link href="/forgot-password">
                <span className="float-left ml-1">{labelForm}</span>
              </Link>
            ) : (
              <span>{isSubmitSuccessful && labelForm}</span>
            )}
          </div>
        )}

        {/* submit button */}
        <button className="cursor-pointer font-bold bg-card-black-background text-white rounded-sm p-2 mt-2 mb-3 w-full"
        type="submit"
        disabled={isSubmitting}>{isSubmitting ? "Loading..." : buttonText}</button>

        {/* form footer description */}
        <span className="font-regular text-sm">
        {footerDescription}
        <Link href={`/${footerHref}`}><span className="font-bold ml-1 capitalize">{footerHref}</span></Link>
        </span>
      </form>
    </div>
  );
}

