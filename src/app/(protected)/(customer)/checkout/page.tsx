import CheckoutContent from "@/components/ui/checkout-section/checkout-content";

export default function Checkout(){
    return (
        <main className="bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full sm:max-w-4xl mx-auto p-4">
            <div><CheckoutContent /></div>
        </main>
    );
}