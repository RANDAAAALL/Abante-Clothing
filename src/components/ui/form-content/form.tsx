"use client"

import Link from "next/link";
import { useEffect } from "react";
import { useForm, SubmitHandler, FieldValues, Path } from "react-hook-form";

export type FieldProps<T extends FieldValues> = {
  fieldName: keyof T;          
  fieldPlaceholder: string;
  fieldType?: string;
};

type FormsContentProps<T extends FieldValues> = {
  title: string;
  description?: string;
  fields: FieldProps<T>[];
  onSubmit: SubmitHandler<T>;
  buttonText: string;
  labelForm?: string;
  footerDescription?: string;
  footerHref?: string;
  onResetRef?: (reset: () => void) => void;
};

export default function FormsContent<T extends FieldValues>({
  title,
  description,
  fields,
  onSubmit,
  buttonText,
  labelForm, 
  footerDescription,
  footerHref,
  onResetRef,
}: FormsContentProps<T>) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm<T>();

  useEffect(() => {
    if (onResetRef) {
      onResetRef(() => reset());
    }
  }, [reset, onResetRef]);

  return (
    <div className="min-h-[600] md:min-h-screen flex items-center justify-center mx-auto md:max-w-lg ">
    <form onSubmit={handleSubmit(onSubmit)} className="text-white shadow-xl p-6 md:p-9 py-8 rounded-xl bg-card-background w-full ">
    <span className="font-bold text-xl">{title}</span>
    <p className="font-regular text-sm mt-1 mb-5">{description}</p>
      {fields.map((field, i) => (
        <div key={i} className="font-regular flex flex-col">
          <label htmlFor={field.fieldName.toString()} className="text-left text-md ml-1 mb-1 capitalize font-bold">{
          field.fieldName === "confirmPassword" ? field.fieldName.split(/(?=[A-Z])/).join(" ").toString() : field.fieldName.toString()}
          </label>
          <input
            className="text-sm border border-t-1 border-input-background focus:outline-none mb-4 rounded-sm p-3 px-4"
            {...register(field.fieldName as Path<T>, { required: true })}
            placeholder={field.fieldPlaceholder}
            type={field.fieldType || "text"}
            />
          {errors[field.fieldName] && <span className="text-red-500 text-sm text-left -mt-3 ml-1 mb-2">This field is required</span>}
        </div>
      ))}
      {labelForm && (
        <div className="text-sm mb-1">
        {labelForm === "Forgot Password?" ? (
          <Link href="/forgot-password">
          <span className={`float-left ml-1`}>{labelForm}</span>
          </Link>
        ) : (
          <span>{isSubmitSuccessful && labelForm}</span>
        )}
        </div>
        )
      }
      <button className="cursor-pointer font-bold bg-white text-black rounded-sm p-2 mt-2 mb-3 w-full" type="submit">{buttonText}</button>
      <span className="font-regular text-sm">{footerDescription}<Link href={`/${footerHref}`}><span className="font-bold ml-1 capitalize">{footerHref}</span></Link></span>
    </form>
    </div>
  );
}
