
export const getPaymentBadgeColor = (paymentMethod: string) => {
    const p = paymentMethod.toLowerCase();
    switch(p){
        case "gcash": return "bg-blue-200 text-blue-700";
        case "paymaya": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200"
    }
}