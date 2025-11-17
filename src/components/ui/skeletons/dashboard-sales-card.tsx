import { Card, CardContent, CardHeader } from "../carousel/card";

export default function DashboardSalesSkeleton() {
  return (
    <div className="flex flex-col mt-8 animate-pulse">
      {/* Period Buttons */}
      <div className="flex flex-col md:flex-row gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="dashboard-sales-skeleton h-8 w-full md:w-20 rounded-sm" />
        ))}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="bg-card border-border dark:bg-card-black-background"
          >
            <CardHeader className="pb-2">
              <div className="dashboard-sales-skeleton h-4 w-24 mb-2" />
            </CardHeader>
            <CardContent>
              <div className="dashboard-sales-skeleton h-8 w-32 mb-2" />
              <div className="dashboard-sales-skeleton h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
        {[1, 2].map((i) => (
          <Card
            key={i}
            className="bg-card border-border dark:bg-card-black-background"
          >
            <CardHeader>
              <div className="dashboard-sales-skeleton h-4 w-32 mb-2" />
              <div className="dashboard-sales-skeleton h-3 w-20" />
            </CardHeader>
            <CardContent className="h-64">
              <div className="dashboard-sales-skeleton h-full w-full rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
