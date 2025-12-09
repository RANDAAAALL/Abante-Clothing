"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddressAndBillingSchema, AddressAndBillingType } from "@/lib/validations/address-and-billing-schema";
import { useAddressAndBillingModal } from "@/lib/store/address-and-billing";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import isEqual from "lodash.isequal";
import omit from "lodash.omit";
import { actionAddAddressOrBilling } from "@/lib/actions/handle-add-address-or-billing";
import { actionEditAddressOrBilling } from "@/lib/actions/handle-edit-address-or-billing";

export default function AddressAndBillingFormContent() {
  const { register, handleSubmit, reset, watch ,formState: { errors, isSubmitting } } = useForm<AddressAndBillingType>({
    resolver: zodResolver(AddressAndBillingSchema),
    defaultValues: { country: "Philippines" },
  });
  const { title,
          action,
          setClose,
          address_ID,
          setResetTitle,
          setResetAction,
          selectedFormData,
          setClearAddressID,
          setClearSelectedFormData,
        } = useAddressAndBillingModal();
  const router = useRouter();

  useEffect(() => {
      if(selectedFormData){
        reset(selectedFormData)
      } else {
        reset({ country: "Philippines" });
      }
  }, [selectedFormData, reset]);

  const handleClickSubmit = async (formData: AddressAndBillingType) => {
    return toast.promise(
        (async () => {
          if (selectedFormData) {
            const cleanSelectedData = omit(selectedFormData, ["address_ID"]);
            if (isEqual(formData, cleanSelectedData)) {
              throw new Error("Please update at least one field before submitting.");
            }
          }          
            
            if(action === "Add"){
              const res = await actionAddAddressOrBilling(title!, formData);

              if(res.status !== 200) throw new Error(`${res.errorMessage}`);

              return res;
            } else {
                const res = await actionEditAddressOrBilling(address_ID!, title!, formData);
                if(res.status !== 200) throw new Error(`${res.errorMessage}`);

                return res;
            }
        })(), {
            loading: `${action === "Add" ? "Adding" : "Updating"}...`,
            success: (message) => { 

              // type guard to ensure successMessage exists
              if ('successMessage' in message && message.successMessage) {
                return message.successMessage;
              }
              
              // Fallback
              router.refresh();
              return `${action === "Add" ? "Added" : "Updated"} successfully`;             
            },
            error: (e) => e?.message || `Failed to ${action === "Add" ? "Add" : "Update"}.`
        },{ duration: 5000 }
        ).finally(() => {
          setClose();
          reset();
          setResetTitle();
          setResetAction();
          setClearSelectedFormData(); 
          setClearAddressID();
        }
    )
  }
  return (
    <form
      onSubmit={handleSubmit(handleClickSubmit)}
      className="flex flex-col w-full h-auto rounded-md mt-3 space-y-3 dark:bg-card-black-background">
      {/* country */}
      <input {...register("country")} disabled className="border-2 rounded-sm border-gray w-full p-3"/>

      {/* firstName and lastName */}
      <div className="flex text-sm w-full space-x-2">
        <div className="w-1/2">
          <input className="border-2 rounded-sm border-gray w-full p-3" {...register("recipientFirstName")} placeholder="First Name"/>
          {errors.recipientFirstName && (
            <p className="text-red-600 text-xs ml-1 mt-1">{errors.recipientFirstName.message}</p>
          )}
        </div>

        <div className="w-1/2">
          <input className="border-2 rounded-sm border-gray w-full p-3" {...register("recipientLastName")} placeholder="Last Name"/>
          {errors.recipientLastName && (
            <p className="text-red-600 text-xs ml-1 mt-1">{errors.recipientLastName.message}</p>
          )}
        </div>
      </div>

      {/* company */}
      <div className="text-sm w-full">
        <input className="border-2 rounded-sm border-gray w-full p-3" {...register("companyName")} placeholder="Company (optional)"/>
      </div>

      {/* address */}
      <div className="text-sm w-full">
        <input className="border-2 rounded-sm border-gray w-full p-3" {...register("addressName")} placeholder="Address"/>
        {errors.addressName && ( <p className="text-red-600 text-xs ml-1 mt-1">{errors.addressName.message}</p>)}
      </div>

      {/* apartment name */}
      <div className="text-sm w-full">
        <input className="border-2 rounded-sm border-gray w-full p-3" {...register("apartmentName")} placeholder="Apartment, suite, etc. (optional)"/>
      </div>

      {/* postal code and city */}
      <div className="text-sm flex space-x-2 w-full">
        <div className="w-1/2">
          <input className="border-2 rounded-sm border-gray w-full p-3" {...register("postalCode")} placeholder="Postal Code"/>
          {errors.postalCode && <p className="text-red-600 text-xs text-left ml-1 mt-1">{errors.postalCode.message}</p>}
        </div>

        <div className="w-1/2">
          <input className="border-2 rounded-sm border-gray w-full p-3" {...register("cityName")} placeholder="City"/>
          {errors.cityName && <p className="text-red-600 text-xs text-left ml-1 mt-1">{errors.cityName.message}</p>}
        </div>
      </div>

      {/* region */}
      <div className="w-full">
        <input className="border-2 rounded-sm border-gray w-full p-3" {...register("regionName")} placeholder="Region"/>
        {errors.regionName && <p className="text-red-600 text-xs text-left ml-1 mt-1">{errors.regionName.message}</p>}
      </div>

      {/* phone number */}
      <div className="w-full">
        <input className="border-2 rounded-sm border-gray w-full p-3" {...register("phoneNumber")} placeholder="Phone No."/>
        {errors.phoneNumber && <p className="text-red-600 text-xs text-left ml-1 mt-1">{errors.phoneNumber.message}</p>}
      </div>

      {/* buttons */}
      <div className="flex space-x-2 mt-3 w-full">
        <button
          onClick={() => {
            setClose();
            setResetAction();
            setResetTitle();
          }}
          disabled={isSubmitting}
          type="button"
          className={`${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"} px-6 py-2.5 w-full rounded-md border border-gray-400 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all`}>
          Close
        </button>

        <button
          disabled={isSubmitting}
          type="submit"
          className={`${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"} px-6 py-2.5 w-full rounded-md bg-card-black-background text-white dark:bg-card-white-background dark:text-black hover:opacity-90 transition-all`}>
          {isSubmitting ? `${action === "Add" ? "Adding..." : "Updating..."}` : `${action === "Add" ? "Add" : "Update"}`}
        </button>
      </div>
    </form>
  );
}
