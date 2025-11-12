"use client";
import { CheckoutFormType, CheckoutSchema } from "@/lib/validations/checkout-schema";
import { Card } from "../carousel/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import useGetCart from "@/hooks/useGetCart";
import { useEffect, useState, useRef } from "react";
import { useCheckoutModal } from "@/lib/store/checkout-items";
import useDeleteAllCart from "@/hooks/useDeleteAllCart";
import { DefaultAddressAndBillingProps } from "@/lib/types/address-and-billing-form-types";

export default function CheckoutformContent({ defaultAddressAndBilling }: { defaultAddressAndBilling: DefaultAddressAndBillingProps }) {
  const {
    isSuccessfullPay,
    setPayment,
    setOpenConfirmationModal,
    setSubmittedFormCheckoutFormData,
    setItemsData,
  } = useCheckoutModal();
  const { data } = useGetCart();
  const { mutate: clearItems } = useDeleteAllCart();
  const { shipping, billing } = defaultAddressAndBilling;

  const { register, handleSubmit, reset, resetField, watch, setValue, formState: { errors, isSubmitting } 
        } = useForm<CheckoutFormType>({ resolver: zodResolver(CheckoutSchema) });
  const watchedValues = watch();

  const [useDifferentBilling, setUseDifferentBilling] = useState<boolean>(false);
  const [useDefaultShipping, setUseDefaultShipping] = useState(false);
  const [useDefaultBilling, setUseDefaultBilling] = useState(false);

  // track the changes
  const isProgrammaticChange = useRef(false);
  const shippingFieldsFilled = useRef(false);
  const billingFieldsFilled = useRef(false);

  useEffect(() => {
    if (useDefaultShipping && shipping && !shippingFieldsFilled.current) {
      isProgrammaticChange.current = true;
      
      setValue("recipientFirstName", shipping.recipientFirstName ?? "");
      setValue("recipientLastName", shipping.recipientLastName ?? "");
      setValue("companyName", shipping.companyName ?? "");
      setValue("addressName", shipping.addressName ?? "");
      setValue("apartmentName", shipping.apartmentName ?? "");
      setValue("postalCode", shipping.postalCode ?? "");
      setValue("cityName", shipping.cityName ?? "");
      setValue("regionName", shipping.regionName ?? "");
      setValue("phoneNumber", shipping.phoneNumber ?? "");
      
      shippingFieldsFilled.current = true;
      
      // reset the flag after a slight delay
      setTimeout(() => {
        isProgrammaticChange.current = false;
      }, 100);
    } else if (!useDefaultShipping && shippingFieldsFilled.current) {
      isProgrammaticChange.current = true;
      
      // Clear fields
      setValue("recipientFirstName", "");
      setValue("recipientLastName", "");
      setValue("companyName", "");
      setValue("addressName", "");
      setValue("apartmentName", "");
      setValue("postalCode", "");
      setValue("cityName", "");
      setValue("regionName", "");
      setValue("phoneNumber", "");
      
      shippingFieldsFilled.current = false;
      
      setTimeout(() => {
        isProgrammaticChange.current = false;
      }, 100);
    }
    }, [useDefaultShipping, shipping, setValue]);

  // auto-uncheck shipping address only if user edits
  useEffect(() => {
    if (useDefaultShipping && shipping && !isProgrammaticChange.current) {
      const isChanged =
        watchedValues.recipientFirstName !== (shipping.recipientFirstName ?? "") ||
        watchedValues.recipientLastName !== (shipping.recipientLastName ?? "") ||
        watchedValues.companyName !== (shipping.companyName ?? "") ||
        watchedValues.addressName !== (shipping.addressName ?? "") ||
        watchedValues.apartmentName !== (shipping.apartmentName ?? "") ||
        watchedValues.postalCode !== (shipping.postalCode ?? "") ||
        watchedValues.cityName !== (shipping.cityName ?? "") ||
        watchedValues.regionName !== (shipping.regionName ?? "") ||
        watchedValues.phoneNumber !== (shipping.phoneNumber ?? "");

      if (isChanged) {
        setUseDefaultShipping(false);
        shippingFieldsFilled.current = false;
      }
    }
    }, [watchedValues, useDefaultShipping, shipping]);

    useEffect(() => {
    if (useDefaultBilling && billing && !billingFieldsFilled.current) {
      isProgrammaticChange.current = true;
      
      setValue("billingFirstName", billing.recipientFirstName ?? "");
      setValue("billingLastName", billing.recipientLastName ?? "");
      setValue("billingCompanyName", billing.companyName ?? "");
      setValue("billingAddressName", billing.addressName ?? "");
      setValue("billingApartmentName", billing.apartmentName ?? "");
      setValue("billingPostalCode", billing.postalCode ?? "");
      setValue("billingCityName", billing.cityName ?? "");
      setValue("billingRegionName", billing.regionName ?? "");
      setValue("billingPhoneNumber", billing.phoneNumber ?? "");
      
      billingFieldsFilled.current = true;
      
      setTimeout(() => {
        isProgrammaticChange.current = false;
      }, 100);
    } else if (!useDefaultBilling && billingFieldsFilled.current) {
      isProgrammaticChange.current = true;
      
      setValue("billingFirstName", "");
      setValue("billingLastName", "");
      setValue("billingCompanyName", "");
      setValue("billingAddressName", "");
      setValue("billingApartmentName", "");
      setValue("billingPostalCode", "");
      setValue("billingCityName", "");
      setValue("billingRegionName", "");
      setValue("billingPhoneNumber", "");
      
      billingFieldsFilled.current = false;
      
      setTimeout(() => {
        isProgrammaticChange.current = false;
      }, 100);
    }
    }, [useDefaultBilling, billing, setValue]);

    // auto-uncheck billing address only if user edits
    useEffect(() => {
    if (useDefaultBilling && billing && !isProgrammaticChange.current) {
      const isChanged =
        watchedValues.billingFirstName !== (billing.recipientFirstName ?? "") ||
        watchedValues.billingLastName !== (billing.recipientLastName ?? "") ||
        watchedValues.billingCompanyName !== (billing.companyName ?? "") ||
        watchedValues.billingAddressName !== (billing.addressName ?? "") ||
        watchedValues.billingApartmentName !== (billing.apartmentName ?? "") ||
        watchedValues.billingPostalCode !== (billing.postalCode ?? "") ||
        watchedValues.billingCityName !== (billing.cityName ?? "") ||
        watchedValues.billingRegionName !== (billing.regionName ?? "") ||
        watchedValues.billingPhoneNumber !== (billing.phoneNumber ?? "");

      if (isChanged) {
        setUseDefaultBilling(false);
        billingFieldsFilled.current = false;
      }
    }
    }, [watchedValues, useDefaultBilling, billing]);
   
    useEffect(() => {
        if(isSuccessfullPay && data?.length) {
            reset();
            clearItems();
        }

    }, [isSuccessfullPay, data, clearItems, setItemsData, reset]);

    const handleClickSubmit = async (formData: CheckoutFormType) => {
        try {
            if(!data || data?.length <= 0){
                toast.error("Your cart is currently empty.");
                return;
            }
            const copy = [...data];
            setItemsData(copy);
            const res = { paymentMethod: formData.paymentMethod };
            setPayment(res);
            setSubmittedFormCheckoutFormData(formData);
            setOpenConfirmationModal();
        } catch (err) {
            toast.error(`Error in submission: ${err}`);
        }
    };

    return (
        <>
        <Card className="h-auto rounded-md mt-6 gap-2 dark:bg-card-black-background p-5">
            <span className="font-medium text-lg">Delivery</span>
            <form onSubmit={handleSubmit(handleClickSubmit)} className="space-y-2.5">

            {/* country  */}
            <div className="p-2 space-y-1 flex flex-col items-start border-2 rounded-sm border-gray w-full">
                <label className="text-xs ml-1" htmlFor="country">Country</label>
                <select id="country" {...register("country")} className="w-full text-sm rounded-sm focus:bg-transparent border-none focus:outline-none">
                    <option value="#" disabled className="dark:bg-[#1E1E1E] dark:text-white border-none">Select a country</option>
                    <option value="Philippines" className="dark:bg-[#1E1E1E] dark:text-white border-none">Philippines</option>
                </select>
                {errors.country && <p className="text-red-600 text-sm text-left -mt-3 ml-1 mb-2"></p>}
            </div>

            {/* firstName and lastName */}
            <div className="flex space-x-2 text-sm">
                <div>
                    <input className="border-2 rounded-sm border-gray w-full p-3" {...register("recipientFirstName")} placeholder="First Name"/>
                    {errors.recipientFirstName && <p className="text-red-600 text-xs text-left ml-1 mt-1">{errors.recipientFirstName.message}</p>}
                </div>
                
                <div>
                    <input className="border-2 rounded-sm border-gray w-full p-3" {...register("recipientLastName")} placeholder="Last Name"/>
                    {errors.recipientLastName && <p className="text-red-600 text-xs text-left ml-1 mt-1">{errors.recipientLastName.message}</p>}
                </div>
            </div>

            {/* company */}
            <div className="text-sm"><input className="border-2 rounded-sm border-gray w-full p-3" {...register("companyName")} placeholder="Company (optional)"/>
            {errors.companyName && <p className="text-red-600 text-sm text-left -mt-3 ml-1 mb-2">{errors.companyName.message}</p>}
            </div>

            {/* address */}
            <div className="text-sm"><input className="border-2 rounded-sm border-gray w-full p-3" {...register("addressName")} placeholder="Address"/>
            {errors.addressName && <p className="text-red-600 text-xs text-left ml-1 mt-1">{errors.addressName.message}</p>}
            </div>

            {/* apartment name */}
            <div className="text-sm"><input className="border-2 rounded-sm border-gray w-full p-3" {...register("apartmentName")} placeholder="Apartment, suite, etc. (optional)"/>
            </div>

            {/* postal code and city */}
            <div className="text-sm flex space-x-2">
                <div>
                    <input className="border-2 rounded-sm border-gray w-full p-3" {...register("postalCode")} placeholder="Postal Code"/>
                    {errors.postalCode && <p className="text-red-600 text-xs text-left ml-1 mt-1">{errors.postalCode.message}</p>}
                </div>

                <div>
                    <input className="border-2 rounded-sm border-gray w-full p-3" {...register("cityName")} placeholder="City"/>
                    {errors.cityName && <p className="text-red-600 text-xs text-left ml-1 mt-1">{errors.cityName.message}</p>}
                </div>  
            </div>

            {/* region */}
            <div>
                <input className="border-2 rounded-sm border-gray w-full p-3" {...register("regionName")} placeholder="Region"/>
                {errors.regionName && <p className="text-red-600 text-xs text-left ml-1 mt-1">{errors.regionName.message}</p>}
            </div>
            
            {/* phone number */}
            <div>
                <input className="border-2 rounded-sm border-gray w-full p-3" {...register("phoneNumber")} placeholder="Phone No."/>
                {errors.phoneNumber && <p className="text-red-600 text-xs text-left ml-1 mt-1">{errors.phoneNumber.message}</p>}
            </div>

                {/* delivery address checkbox*/}
                { shipping && (
                    <div className="flex space-x-2 mb-5 ml-1">
                        <input 
                        type="checkbox" 
                        checked={useDefaultShipping}
                        onChange={(e) => setUseDefaultShipping(e.target.checked)}
                        className="w-4 h-4"/>
                        <span className="text-sm">Use default delivery address</span>
                    </div>
                )}

                {/* Payment radio buttons*/}
                <div className="flex flex-col">
                    <span className="font-medium text-lg">Payment</span>
                    <span className="text-[14px]">All transactions are secure and encrypted</span>
                
                    <div className="flex flex-col border-2 rounded-sm border-gray w-full p-3 mt-1.5">
                        <div className="flex items-center space-x-2.5">
                            <input {...register("paymentMethod")} type="radio" className="w-3.5 h-3.5" name="paymentMethod" value="gcash"/>
                            <span className="text-sm">Gcash</span>
                        </div>
                    </div>

                    <div className="flex flex-col border-2 rounded-sm border-gray w-full p-3">
                        <div className="flex items-center space-x-2.5">
                            <input {...register("paymentMethod")} type="radio" className="w-3.5 h-3.5" name="paymentMethod" value="paymaya"/>
                            <span className="text-sm">Paymaya</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col border-2 rounded-sm border-gray w-full p-3">
                        <div className="flex items-center space-x-2.5 text-gray-500 cursor-not-allowed">
                            <input {...register("paymentMethod")} type="radio" disabled={true} className="w-3.5 h-3.5" name="paymentMethod" value="bank-transfer"/>
                            <span className="text-sm">Bank Transfer | Under Maintenance</span>
                        </div>
                    </div>
                    {errors.paymentMethod && <p className="text-red-600 text-xs text-left ml-1 mt-1">{errors.paymentMethod.message}</p>}

                    {/* Billing Address Type */}
                    <div className="flex flex-col mb-5 mt-5">
                    <span className="text-[14px]">Billing Address</span>
                    
                        <div className="flex items-center space-x-2.5 border-2 rounded-sm border-gray w-full p-3 mt-1.5">
                            <input 
                            {...register("addressType")}
                            type="radio"
                            className="w-3.5 h-3.5"
                            name="addressType"
                            value="shipping-address"
                            onClick={() => {
                                setUseDifferentBilling(false);
                                resetField("billingFirstName");
                                resetField("billingLastName");
                                resetField("billingCompanyName");
                                resetField("billingAddressName");
                                resetField("billingApartmentName");
                                resetField("billingPostalCode");
                                resetField("billingCityName");
                                resetField("billingRegionName");
                                resetField("billingPhoneNumber");
                            }}/>
                            <span className="text-sm">Same as shipping address</span>
                        </div>
                        <div className="flex items-center space-x-2.5 border-2 rounded-sm border-gray w-full p-3">
                            <input
                            {...register("addressType")}
                            type="radio"
                            className="w-3.5 h-3.5"
                            name="addressType"
                            value="billing-address"
                            onClick={() => setUseDifferentBilling(true)}/>
                            <span className="text-sm">Use different billing address</span>
                        </div>
                        {errors.addressType && <p className="text-red-600 text-xs text-left ml-1 mt-1">{errors.addressType.message}</p>}
                    </div>
                </div>

                {useDifferentBilling && (
                    <div className="border-t border-gray-300 pt-4 space-y-2.5">
                        <div className="mb-2">
                        <span className="font-medium text-md">Billing Address</span>
                        </div>

                        <div className="flex space-x-2 text-sm">
                        <div className="w-full">
                            <input
                            className="border-2 rounded-sm border-gray w-full p-3"
                            placeholder="First Name"
                            {...register("billingFirstName")}
                            />
                            {errors.billingFirstName && (
                            <p className="text-red-600 text-xs text-left ml-1 mt-1">
                                {errors.billingFirstName.message}
                            </p>
                            )}
                        </div>
                        <div className="w-full">
                            <input
                            className="border-2 rounded-sm border-gray w-full p-3"
                            placeholder="Last Name"
                            {...register("billingLastName")}
                            />
                            {errors.billingLastName && (
                            <p className="text-red-600 text-xs text-left ml-1 mt-1">
                                {errors.billingLastName.message}
                            </p>
                            )}
                        </div>
                        </div>

                        <div className="text-sm">
                        <input
                            className="border-2 rounded-sm border-gray w-full p-3"
                            placeholder="Company (optional)"
                            {...register("billingCompanyName")}
                        />
                        </div>

                        <div className="text-sm">
                        <input
                            className="border-2 rounded-sm border-gray w-full p-3"
                            placeholder="Address"
                            {...register("billingAddressName")}
                        />
                        {errors.billingAddressName && (
                            <p className="text-red-600 text-xs text-left ml-1 mt-1">
                            {errors.billingAddressName.message}
                            </p>
                        )}
                        </div>

                        <div className="text-sm">
                        <input
                            className="border-2 rounded-sm border-gray w-full p-3"
                            placeholder="Apartment, suite, etc. (optional)"
                            {...register("billingApartmentName")}
                        />
                        </div>

                        <div className="flex space-x-2 text-sm">
                        <div className="w-full">
                            <input
                            className="border-2 rounded-sm border-gray w-full p-3"
                            placeholder="Postal Code"
                            {...register("billingPostalCode")}
                            />
                            {errors.billingPostalCode && (
                            <p className="text-red-600 text-xs text-left ml-1 mt-1">
                                {errors.billingPostalCode.message}
                            </p>
                            )}
                        </div>
                        <div className="w-full">
                            <input
                            className="border-2 rounded-sm border-gray w-full p-3"
                            placeholder="City"
                            {...register("billingCityName")}
                            />
                            {errors.billingCityName && (
                            <p className="text-red-600 text-xs text-left ml-1 mt-1">
                                {errors.billingCityName.message}
                            </p>
                            )}
                        </div>
                        </div>

                        <div className="text-sm">
                        <input
                            className="border-2 rounded-sm border-gray w-full p-3"
                            placeholder="Region"
                            {...register("billingRegionName")}
                        />
                        {errors.billingRegionName && (
                            <p className="text-red-600 text-xs text-left ml-1 mt-1">
                            {errors.billingRegionName.message}
                            </p>
                        )}
                        </div>

                        <div className="text-sm">
                        <input
                            className="border-2 rounded-sm border-gray w-full p-3"
                            placeholder="Phone No."
                            {...register("billingPhoneNumber")}
                        />
                        {errors.billingPhoneNumber && (
                            <p className="text-red-600 text-xs text-left ml-1 mt-1">
                            {errors.billingPhoneNumber.message}
                            </p>
                        )}
                        </div>
                        
                        {/* checkbox billing address */}
                        { billing && (
                            <div className="flex space-x-2 mb-5 ml-1">
                                <input 
                                type="checkbox" 
                                checked={useDefaultBilling}
                                onChange={(e) => setUseDefaultBilling(e.target.checked)}
                                className="w-4 h-4"/>
                                <span className="text-sm">Use default billing address</span>
                            </div>
                        )}
                    </div>
                )}
                <button 
                disabled={isSubmitting}
                type="submit"
                className={`${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"}
                ${useDifferentBilling && "mt-3"} text-sm bg-card-black-background text-white dark:bg-card-white-background dark:text-black rounded-sm py-2.5 w-full`}>
                {isSubmitting ? "Processing Order..." : "Complete Order"}
                </button>
            </form>
        </Card>
        </>
    );
}