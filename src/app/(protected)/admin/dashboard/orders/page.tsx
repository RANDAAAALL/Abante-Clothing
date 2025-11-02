import OrdersContent from "@/components/ui/admin-dashboard/orders-section/orders-content";

export default function AdminDashboardOrders(){
    return (
        <div className="bg-white dark:bg-black-background dark:text-white text-black w-full max-w-[1980] mx-auto">
            <OrdersContent />
        </div>
    );
}