
export default function OrderHistorySkeleton() {
  return (
    <>
      {/* ==== FILTER BAR ==== */}
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="h-8 order-history-skeleton rounded w-20"></div>
        <div className="h-10 order-history-skeleton rounded w-40"></div>
      </div>

      {/* ==== ORDERS GRID ==== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-0.5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-muted/30 p-4 space-y-4"
          >
            {/* ==== HEADER ==== */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-4 w-32 order-history-skeleton rounded" />
                <div className="h-3 w-24 order-history-skeleton rounded" />
              </div>
              <div className="h-6 w-20 order-history-skeleton rounded" />
            </div>

            {/* ==== PRODUCTS ==== */}
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, productIndex) => (
                <div key={productIndex} className="flex gap-3">
                  <div className="h-12 w-12 order-history-skeleton rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 order-history-skeleton rounded" />
                    <div className="h-3 w-1/2 order-history-skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>

            {/* ==== STATUS & TOTAL ==== */}
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 w-16 order-history-skeleton rounded" />
              <div className="h-5 w-20 order-history-skeleton rounded" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
