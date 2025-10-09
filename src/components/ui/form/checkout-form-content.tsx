"use client"
import { CheckoutFormType, CheckoutSchema } from "@/lib/validations/checkout-schema";
import { Card } from "../carousel/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import useGetCart from "@/hooks/useGetCart";
import { useEffect, useState } from "react";
import { useCheckoutModal } from "@/lib/store/checkout-items";
import useDeleteAllCart from "@/hooks/useDeleteAllCart";
import { CheckoutURL } from "@/lib/config";

export default function CheckoutformContent(){
    const { isSuccessfullPay,
            setCloseModal,
            setResetCompleteOrderTrigger,
            setClearComputeItems,
            setClearPayment,
            setPayment, 
            setOpenModal,
            setResetSuccessfullPay,
            setSuccessfullPay} = useCheckoutModal();
    const { mutate: clearItems } = useDeleteAllCart();
    const { data } = useGetCart();
    const [ submittedData, setSubmittedData ] = useState<CheckoutFormType | null>(null);
    const { register,
            handleSubmit,
            reset,
            formState: {errors, isSubmitting}
        } = useForm<CheckoutFormType>({resolver: zodResolver(CheckoutSchema)});

            useEffect(() => {
                if(isSuccessfullPay && submittedData){
                    toast.promise(
                    (async () => {
                        const res = await fetch(`${CheckoutURL}`, {
                            method: 'POST',
                            body: JSON.stringify(submittedData)
                        });

                    const data = await res.json();
                    if(!res.ok) throw new Error( data?.errorMessage || "Something went wrong while processing your payment.");

                    // resets after user successfully purchased
                    clearItems();
                    setResetCompleteOrderTrigger();
                    setClearComputeItems();
                    setClearPayment();
                    setResetSuccessfullPay();
                    reset();
                    setCloseModal();
                })(), {
                    loading: 'Payment processing...',
                    success: 'Payment successful\nYour order is now being processed',
                    error: (e) => e?.message || 'Payment failed' 
                }
            )

            toast("Take note: checkout flow is still under development...", { duration: 4000 });
        };
    }, [isSuccessfullPay, submittedData]);

    const handleClickSubmit = async (formData: CheckoutFormType) => {
        try {
            if(!data || data?.length <= 0){
                toast.error("Your cart is currently empty.")
                return;
            }

            const res = { paymentMethod: formData.paymentMethod };
            setPayment(res);
            setSubmittedData(formData);
            setOpenModal();
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
            <div className="p-2 space-y-1 flex flex-col items-start border border-2 rounded-sm border-gray w-full">
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
                {errors.phoneNumber && <p className="text-red-600 text-xs text-left -mt-3 ml-1 mt-1">{errors.phoneNumber.message}</p>}
            </div>

            {/* checkbox  */}
            <div className="flex space-x-2 mb-5 ml-1">
                <input type="checkbox" className="w-4 h-4" {...register("saveInformation")}/>
                <span className="text-sm">Save this information for next time</span>
            </div>

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
                    <div className="flex items-center space-x-2.5">
                        <input {...register("paymentMethod")} type="radio" className="w-3.5 h-3.5" name="paymentMethod" value="bank-transfer"/>
                        <span className="text-sm">Bank Transfer</span>
                    </div>
                </div>
                {errors.paymentMethod && <p className="text-red-600 text-xs text-left ml-1 mt-1">{errors.paymentMethod.message}</p>}

                {/* Billing Address Type */}
                <div className="flex flex-col mb-5 mt-5">
                 <span className="text-[14px]">Billing Address</span>
                
                    <div className="flex items-center space-x-2.5 border-2 rounded-sm border-gray w-full p-3 mt-1.5">
                        <input {...register("addressType")} type="radio" className="w-3.5 h-3.5" name="addressType" value="shipping-address"/>
                        <span className="text-sm">Same as shipping address</span>
                    </div>
                    <div className="flex items-center space-x-2.5 border-2 rounded-sm border-gray w-full p-3">
                        <input {...register("addressType")} type="radio" className="w-3.5 h-3.5" name="addressType" value="billing-address"/>
                        <span className="text-sm">Use different billing address</span>
                    </div>
                    {errors.addressType && <p className="text-red-600 text-xs text-left ml-1 mt-1">{errors.addressType.message}</p>}
                </div>
            </div>
                    <button 
                    disabled={isSubmitting}
                    type="submit"
                    className={`${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"} text-sm bg-card-black-background text-white dark:bg-card-white-background dark:text-black rounded-sm py-2.5 w-full`}>{isSubmitting ? "Processing Order..." : "Complete Order"}</button>
            </form>
        </Card>
        </>
    );
}