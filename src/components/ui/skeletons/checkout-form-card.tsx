
export default function CheckoutFormSkeleton() {
  return (
    <div className="mt-6">
      <div className="p-5 rounded-md border border-border dark:bg-card-black-background space-y-4">
        {/* === Section Title === */}
        <div className="h-6 w-32 checkout-form-skeleton rounded"></div>

        {/* === Country Dropdown === */}
        <div className="h-12 w-full checkout-form-skeleton rounded"></div>

        {/* === First + Last Name === */}
        <div className="flex space-x-2">
          <div className="h-12 w-full checkout-form-skeleton rounded"></div>
          <div className="h-12 w-full checkout-form-skeleton rounded"></div>
        </div>

        {/* === Company === */}
        <div className="h-12 w-full checkout-form-skeleton rounded"></div>

        {/* === Address === */}
        <div className="h-12 w-full checkout-form-skeleton rounded"></div>

        {/* === Apartment === */}
        <div className="h-12 w-full checkout-form-skeleton rounded"></div>

        {/* === Postal + City === */}
        <div className="flex space-x-2">
          <div className="h-12 w-full checkout-form-skeleton rounded"></div>
          <div className="h-12 w-full checkout-form-skeleton rounded"></div>
        </div>

        {/* === Region === */}
        <div className="h-12 w-full checkout-form-skeleton rounded"></div>

        {/* === Phone Number === */}
        <div className="h-12 w-full checkout-form-skeleton rounded"></div>

        {/* === Use Default Address Checkbox === */}
        <div className="flex items-center gap-2 mt-3">
          <div className="h-4 w-4 checkout-form-skeleton rounded"></div>
          <div className="h-3 w-40 checkout-form-skeleton rounded"></div>
        </div>

        {/* === Payment Section === */}
        <div className="space-y-3 mt-6">
          <div className="h-6 w-32 checkout-form-skeleton rounded"></div>
          <div className="h-4 w-56 checkout-form-skeleton rounded"></div>

          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-12 w-full checkout-form-skeleton rounded"
            ></div>
          ))}
        </div>

        {/* === Billing Address Section === */}
        <div className="space-y-3 mt-5">
          <div className="h-5 w-40 checkout-form-skeleton rounded"></div>
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-12 w-full checkout-form-skeleton rounded"
            ></div>
          ))}
        </div>

        {/* === Billing Address Expanded (Different Billing) === */}
        <div className="border-t border-border pt-4 mt-5 space-y-3">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="h-12 w-full checkout-form-skeleton rounded"
            ></div>
          ))}
        </div>

        {/* === Submit Button === */}
        <div className="h-10 w-full checkout-form-skeleton rounded mt-4"></div>
      </div>
    </div>
  );
}
