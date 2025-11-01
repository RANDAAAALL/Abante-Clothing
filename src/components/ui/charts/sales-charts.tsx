"use client";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../carousel/card";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/useMounted";
import { ChartDataProps } from "@/lib/types/chart-data-types";

export default function SalesCharts({
  data,
  period,
}: {
  data: ChartDataProps[];
  period: "Day" | "Week" | "Month" | "Year";
}) {
  const { theme } = useTheme();
  const mounted = useMounted();

  const periodLabel =
      period === "Day"
      ? "Today"
      : period === "Week"
      ? "Last 7 days"
      : period === "Month"
      ? "This month"
      : "This year";

  const chartColor = theme === "dark" ? "#f2f2f2" : "#000";
  const labelColor = theme === "dark" ? "#fff" : "#000";

  const formatXAxisLabel = (value: string) => {
    if (period === "Day") {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        const [hourStr, minuteStr = "00"] = value.split(":");
        const hour = Number(hourStr);
        const minute = Number(minuteStr);
        const fakeDate = new Date();
        fakeDate.setHours(hour, minute, 0);
        return fakeDate.toLocaleTimeString("en-PH", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      }
      return date.toLocaleTimeString("en-PH", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
    return value;
  };
  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
      
      {/* total revenue - bar chart */}
      <Card className="bg-card border-border dark:bg-card-black-background">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Revenue Breakdown</CardTitle>
          <p className="text-xs text-muted-foreground">{periodLabel}</p>
        </CardHeader>
        <CardContent className="h-64">
          <div className="w-full h-full" style={{ minWidth: 0, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barSize={35}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                <XAxis
                dataKey="month"
                tick={{ fill: "#888", fontSize: 12 }}
                tickFormatter={formatXAxisLabel}/>
                <YAxis
                tick={{ fill: "#888", fontSize: 12 }}
                tickFormatter={(v: number) => Math.floor(v).toString()}/>
                <Tooltip content={<CustomTooltip period={period} />} cursor={{ fill: "transparent" }} />
                <Bar dataKey="totalRevenue" fill={chartColor} radius={[4, 4, 0, 0]}>
                  <LabelList
                  dataKey="totalRevenue"
                  position="top"
                  fill={labelColor}
                  fontSize={12}/>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* sales trend - line chart */}
      <Card className="bg-card border-border dark:bg-card-black-background">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Sales Trend</CardTitle>
          <p className="text-xs text-muted-foreground">{periodLabel}</p>
        </CardHeader>
        <CardContent className="h-64">
          <div className="w-full h-full" style={{ minWidth: 0, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#888", fontSize: 12 }}
                  tickFormatter={formatXAxisLabel}
                />
                <YAxis
                  tick={{ fill: "#888", fontSize: 12 }}
                  tickFormatter={(v: number) => Math.floor(v).toString()}
                />
                <Tooltip content={<CustomTooltip period={period} />} cursor={{ fill: "transparent" }} />
                <Line
                  type="monotone"
                  dataKey="totalSales"
                  stroke={chartColor}
                  strokeWidth={2}
                  dot={{ fill: chartColor }}>
                  <LabelList
                  dataKey="totalSales"
                  position="top"
                  fill={labelColor}
                  fontSize={12}/>
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* custom tooltip for both charts */
const CustomTooltip = ({
  active,
  payload,
  label,
  period,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
  period: "Day" | "Week" | "Month" | "Year";
}) => {
  if (!active || !payload?.length) return null;

  const formattedLabel =
    period === "Day"
      ? (() => {
          const date = new Date(label ?? "");
          if (isNaN(date.getTime())) {
            const [hourStr, minuteStr = "00"] = (label ?? "").split(":");
            const hour = Number(hourStr);
            const minute = Number(minuteStr);
            const fakeDate = new Date();
            fakeDate.setHours(hour, minute, 0);
            return fakeDate.toLocaleTimeString("en-PH", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
          }
          return date.toLocaleTimeString("en-PH", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
        })()
      : label;

  return (
    <div className="rounded-md px-3 py-2 shadow-md bg-white text-black dark:bg-zinc-800 dark:text-white">
      <p className="text-xs opacity-70 mb-1">{formattedLabel}</p>
      {payload.map((entry) => {
        const isRevenue = entry.dataKey === "totalRevenue";
        const labelText = isRevenue ? "Total Revenue" : "Total Sales";
        const formattedValue = entry.value.toLocaleString("en-PH");

        return (
          <p key={entry.dataKey} className="text-sm">
            {labelText}: {isRevenue ? `₱${formattedValue}` : formattedValue}
          </p>
        );
      })}
    </div>
  );
};