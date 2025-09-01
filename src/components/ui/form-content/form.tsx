"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  Path,
  Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
  onSubmit: SubmitHandler<RHFValues<TSchema>>;
  buttonText: string;
  labelForm?: string;
  footerDescription?: string;
  footerHref?: string;
  onResetRef?: (reset: () => void) => void;
  schema: TSchema;
};

export default function FormsContent<TSchema extends AnyZodObject>({
  title,
  description,
  fields,
  onSubmit,
  buttonText,
  labelForm,
  footerDescription,
  footerHref,
  onResetRef,
  schema,
}: FormsContentProps<TSchema>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<RHFValues<TSchema>>({
    resolver: zodResolver(schema) as unknown as Resolver<RHFValues<TSchema>>,
  });

  useEffect(() => {
    onResetRef?.(() => reset());
  }, [reset, onResetRef]);

  return (
    <div className="min-h-[600] md:min-h-screen flex items-center justify-center mx-auto md:max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)}
        className="text-white shadow-xl p-6 md:p-9 py-8 rounded-xl bg-card-background w-full ">

        {/* title and description  */}
        <span className="font-bold text-xl">{title}</span>
        <p className="font-regular text-sm mt-1 mb-5">{description}</p>

        {/* labels and input */}
        {fields.map((field, i) => (
          <div key={i} className="font-regular flex flex-col">
            <label htmlFor={String(field.fieldName)} className="text-left text-md ml-1 mb-1 capitalize font-bold">
            {String(field.fieldName).replace(/([A-Z])/g, " $1")}
            </label>

            <input
              className="text-sm border border-t-1 border-input-background focus:outline-none mb-4 rounded-sm p-3 px-4"
              {...register(field.fieldName)}
              placeholder={field.fieldPlaceholder}
              type={field.fieldType || "text"}/>

            {/* error messages  */}
            {errors[field.fieldName]?.message && (
              <span className="text-red-500 text-sm text-left -mt-3 ml-1 mb-2">
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
        <button className="cursor-pointer font-bold bg-white text-black rounded-sm p-2 mt-2 mb-3 w-full"
          type="submit">{buttonText}</button>

        {/* form footer description */}
        <span className="font-regular text-sm">
        {footerDescription}
        <Link href={`/${footerHref}`}><span className="font-bold ml-1 capitalize">{footerHref}</span></Link>
        </span>
      </form>
    </div>
  );
}
