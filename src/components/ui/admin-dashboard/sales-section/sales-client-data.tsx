"use client";
import { useState, useMemo, useEffect } from "react";
import { SalesDataProps } from "@/lib/types/sales-data-type";
import { Card, CardContent, CardHeader, CardTitle } from "../../carousel/card";
import { startOfWeek } from "@/lib/helper/sale-time-filtering";
import { getWeekOfMonth, monthNames, dayNames } from "@/lib/helper/sales-chart-grouping";
import SalesCharts from "../../charts/sales-charts";
import { useRouter } from "next/navigation";

export default function SalesClientData({ sales }: { sales: SalesDataProps[] }) {
  const [period, setPeriod] = useState<"Day" | "Week" | "Month" | "Year">("Day");
  const now = new Date();
  const router = useRouter();
  
  useEffect(() => {
    router.refresh(); 
    const interval = setInterval(() => {
      console.log("useEffect triggered!");
      router.refresh()
    }, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();
  const isSameWeek = (d1: Date, d2: Date) => startOfWeek(d1).toDateString() === startOfWeek(d2).toDateString();
  const isSameMonth = (d1: Date, d2: Date) => d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  const isSameYear = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear();

  // filter sales based on selected period
  const filteredSales = sales.filter((s) => {
    const date = new Date(s.order_purchased_date);
    switch (period) {
      case "Day": return isSameDay(date, now);
      case "Week": return isSameWeek(date, now);
      case "Month": return isSameMonth(date, now);
      case "Year": return isSameYear(date, now);
      default: return false;
    }
  });

  // compute totals
  const totalSales = filteredSales.length;
  const totalRevenue = filteredSales.reduce((acc, curr) => acc + (curr.order_purchased_totalAmount ?? 0), 0);
  const totalItemsSold = filteredSales.reduce((acc, curr) => {
    const orderQtySum = curr.order_detail_qty?.reduce((sum, q) => sum! + (q ?? 0), 0) ?? 0;
    return acc + orderQtySum;
  }, 0);
  const averageSales = totalSales > 0 ? Math.round(totalRevenue / totalSales) : 0;

  // group data dynamically
  const chartData = useMemo(() => {
    const grouped: Record<string, { totalSales: number; totalRevenue: number }> = {};

    filteredSales.forEach((s) => {
      const date = new Date(s.order_purchased_date);
      let key = "";

      switch (period) {
        case "Day":
          key = `${date.getHours()}:00`;
          break;
        case "Week":
          key = dayNames[date.getDay()];
          break;
        case "Month":
          key = `Week ${getWeekOfMonth(date)}`;
          break;
        case "Year":
          key = monthNames[date.getMonth()];
          break;
      }

      if (!grouped[key]) grouped[key] = { totalSales: 0, totalRevenue: 0 };
      grouped[key].totalSales += 1;
      grouped[key].totalRevenue += s.order_purchased_totalAmount ?? 0;
    });

    return Object.entries(grouped).map(([key, val]) => ({
      month: key,
      totalSales: val.totalSales,
      totalRevenue: val.totalRevenue,
    }));
  }, [filteredSales, period]);

  return (
    <div className="flex flex-col mt-8">
      {/* period buttons */}
      <div className="flex flex-col md:flex-row gap-2">
        {(["Day", "Week", "Month", "Year"] as const).map((p) => (
          <Card
            key={p}
            className={`text-sm font-medium cursor-pointer capitalize gap-0 py-2 px-5 shadow-sm rounded-sm dark:bg-card-black-background ${
              period === p ? "bg-black text-white dark:bg-[#3B3B3B]" : ""
            }`}
            onClick={() => setPeriod(p)}>
            {p}
          </Card>
        ))}
      </div>

      {/* metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
        <Card className="bg-card border-border dark:bg-card-black-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalItemsSold.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">items sold</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border dark:bg-card-black-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              ₱{totalRevenue.toLocaleString("en-PH")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">PHP</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border dark:bg-card-black-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              ₱{averageSales.toLocaleString("en-PH")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">per {period.toLowerCase()}</p>
          </CardContent>
        </Card>
      </div>

      {/* charts */}
      <SalesCharts data={chartData} period={period} />
    </div>
  );
}
