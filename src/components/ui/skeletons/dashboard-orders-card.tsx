export default function DashboardOrdersSkeleton() {
    return (
      <div className="mt-6 space-y-6">
        {/* ==== STATUS CARDS SKELETON ==== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border p-4 bg-muted/30 flex flex-col justify-between h-[150px]"
            >
              {/* Simulate CardHeader (title) */}
              <div className="h-4 w-32 dashboard-orders-skeleton mb-3" />
              {/* Simulate CardContent (number) */}
              <div className="h-8 w-20 dashboard-orders-skeleton" />
            </div>
          ))}
        </div>
  
        {/* ==== FILTER BAR ==== */}
        <div className="flex items-center gap-4 mt-4">
          <div className="h-4 w-24 dashboard-orders-skeleton" />
          <div className="h-8 w-40 dashboard-orders-skeleton" />
        </div>
  
        {/* ==== ORDERS TABLE SKELETON ==== */}
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-8 bg-gray-50 dark:bg-card-black-background px-4 py-2 text-sm font-semibold">
            <div>Order #</div>
            <div>Customer</div>
            <div className="col-span-2">Products</div>
            <div>Total</div>
            <div>Status</div>
            <div>Tracking #</div>
            <div>Date</div>
          </div>
  
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-8 items-center px-4 py-3 border-t border-gray-100 dark:border-gray-800"
            >
              <div className="h-4 w-24 dashboard-orders-skeleton" />
              <div className="h-4 w-20 dashboard-orders-skeleton" />
              <div className="h-4 w-48 col-span-2 dashboard-orders-skeleton" />
              <div className="h-4 w-12 dashboard-orders-skeleton" />
              <div className="h-5 w-16 rounded-full dashboard-orders-skeleton" />
              <div className="h-4 w-24 dashboard-orders-skeleton" />
              <div className="h-4 w-28 dashboard-orders-skeleton" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  