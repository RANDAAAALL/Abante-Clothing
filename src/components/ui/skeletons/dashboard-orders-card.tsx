export default function DashboardOrdersSkeleton() {
  return (
    <div className="mt-6 space-y-6">

      {/* ==== STATUS CARDS SKELETON ==== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border p-6 bg-muted/30 h-[150px] flex flex-col justify-between"
          >
            <div className="h-5 w-32 dashboard-orders-skeleton" />
            <div className="h-8 w-20 dashboard-orders-skeleton" />
          </div>
        ))}
      </div>

      {/* ==== FILTER BAR SKELETON ==== */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row items-center justify-between mt-4 mb-3">

        <div className="flex items-center gap-4">
          <div className="h-4 w-28 sm:w-24 dashboard-orders-skeleton" />
          <div className="h-8 w-40 dashboard-orders-skeleton" />
        </div>

        <div className="h-8 w-full sm:w-52 dashboard-orders-skeleton" />
      </div>

      {/* ==== TABLE SKELETON ==== */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">

          {/* HEADER */}
          <thead className="bg-gray-50 dark:bg-card-black-background">
            <tr>
              {[
                "Order #", "Customer", "Products", "Total", "Status",
                "Tracking #", "Date", "Action"
              ].map((header, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY SKELETON ROWS */}
          <tbody className="divide-y divide-gray-100">

            {[...Array(6)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {/* Order # */}
                <td className="px-4 py-3">
                  <div className="h-4 w-24 dashboard-orders-skeleton" />
                </td>

                {/* Customer */}
                <td className="px-4 py-3">
                  <div className="h-4 w-32 dashboard-orders-skeleton" />
                </td>

                {/* Products */}
                <td className="px-4 py-3">
                  <div className="space-y-2">
                    <div className="h-4 w-40 dashboard-orders-skeleton" />
                    <div className="h-4 w-24 dashboard-orders-skeleton" />
                  </div>
                </td>

                {/* Total */}
                <td className="px-4 py-3">
                  <div className="h-4 w-16 dashboard-orders-skeleton" />
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <div className="h-5 w-24 rounded-full dashboard-orders-skeleton" />
                </td>

                {/* Tracking */}
                <td className="px-4 py-3">
                  <div className="h-4 w-28 dashboard-orders-skeleton" />
                </td>

                {/* Date */}
                <td className="px-4 py-3">
                  <div className="h-4 w-20 dashboard-orders-skeleton" />
                </td>

                {/* Action */}
                <td className="px-4 py-3">
                  <div className="h-8 w-16 rounded-md dashboard-orders-skeleton" />
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
}
