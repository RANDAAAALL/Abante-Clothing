"use client"

import Link from "next/link";
import { useForm, SubmitHandler, FieldValues, Path } from "react-hook-form";

export type FieldProps<T extends FieldValues> = {
  fieldName: keyof T;          
  fieldPlaceholder: string;
  fieldType?: string;
};

type FormsContentProps<T extends FieldValues> = {
  fields: FieldProps<T>[];
  onSubmit: SubmitHandler<T>;
};

export default function FormsContent<T extends FieldValues>({
  fields,
  onSubmit,
}: FormsContentProps<T>) {
  const { register, handleSubmit, formState: { errors } } = useForm<T>();

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="text-white shadow-xl p-6 py-8 rounded-xl bg-card-background w-full ">
    <span className="font-bold text-xl">Create An Account</span>
    <p className="font-regular text-sm mt-1 mb-5">Step up your drip, Join the Abante Fam</p>
      {fields.map((field, i) => (
        <div key={i} className="font-regular flex flex-col">
          <label htmlFor={field.fieldName.toString()} className="text-left text-md ml-1 mb-1 capitalize font-bold">{field.fieldName.toString()}</label>
          <input
            className="text-sm border border-t-1 border-red mb-4 rounded-sm p-3 px-4"
            {...register(field.fieldName as Path<T>, { required: true })}
            placeholder={field.fieldPlaceholder}
            type={field.fieldType}
            />
          {errors[field.fieldName] && (
            <span className="text-red-500 text-sm text-left -mt-3 ml-1 mb-2">This field is required</span>
            )}
        </div>
      ))}
      <button className="cursor-pointer font-bold bg-white text-black rounded-sm p-2 mt-2 mb-4 w-full" type="submit">Submit</button>
      <span className="font-regular text-sm">Already have an account?<Link href="/login"><span className="font-bold ml-1">Login</span></Link></span>
    </form>
    </>
  );
}
