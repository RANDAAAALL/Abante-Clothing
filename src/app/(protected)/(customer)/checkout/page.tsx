import CheckoutContent from "@/components/ui/checkout-section/checkout-content";
import CheckoutModalContent from "@/components/ui/modal/checkout-item/checkout-modal-content";

// export const experimental_ppr = true;

export default function Checkout(){
    return (
        <main className="bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full sm:max-w-4xl mx-auto p-4">
            <CheckoutModalContent />
            <div><CheckoutContent /></div>
        </main>
    );
}