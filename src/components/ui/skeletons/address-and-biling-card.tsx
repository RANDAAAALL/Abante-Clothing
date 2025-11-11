
export default function AddressAndBillingSkeleton() {
  return (
    <div className="space-y-3">
      {/* ==== HEADER BAR ==== */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="h-5 w-74 order-history-skeleton rounded"></div>
        <div className="h-9 w-50 order-history-skeleton rounded"></div>
      </div>

      {/* ==== SELECTED DEFAULT ADDRESS ==== */}
      <div className="py-3 px-5 border border-border rounded-sm dark:bg-card-black-background space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 order-history-skeleton rounded-full"></div>
            <div className="h-4 w-40 order-history-skeleton rounded"></div>
          </div>
          <div className="h-6 w-16 order-history-skeleton rounded"></div>
        </div>
        <div className="h-3 w-32 order-history-skeleton rounded"></div>
        <div className="h-3 w-40 order-history-skeleton rounded"></div>
        <div className="h-3 w-52 order-history-skeleton rounded"></div>
        <div className="h-3 w-44 order-history-skeleton rounded"></div>
      </div>

      {/* ==== ADDRESS CARDS ==== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="py-3 px-5 border border-border rounded-sm dark:bg-card-black-background space-y-3"
          >
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 order-history-skeleton rounded-full"></div>
              <div className="h-4 w-32 order-history-skeleton rounded"></div>
            </div>

            <div className="space-y-1 mt-2">
              <div className="h-3 w-40 order-history-skeleton rounded"></div>
              <div className="h-3 w-56 order-history-skeleton rounded"></div>
              <div className="h-3 w-48 order-history-skeleton rounded"></div>
              <div className="h-3 w-36 order-history-skeleton rounded"></div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <div className="h-6 w-14 order-history-skeleton rounded"></div>
              <div className="h-6 w-14 order-history-skeleton rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
