"use client";

import { useEffect, useState } from "react";
import { getDailySalesMetrics, getTotalRevenue } from "@/lib/actions/analytics";
import { getStoreByVendor } from "@/lib/actions/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface AnalyticsData {
  date: string;
  total_sales: number;
  order_count: number;
  average_order_value: number;
}

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<AnalyticsData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [error, setError] = useState("");
  const [hasStore, setHasStore] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storeResult = await getStoreByVendor();
        if ("error" in storeResult || !storeResult.data) {
          setHasStore(false);
          setIsLoading(false);
          return;
        }

        const storeId = storeResult.data.id;

        const [metricsResult, revenueResult] = await Promise.all([
          getDailySalesMetrics(storeId, 30),
          getTotalRevenue(storeId),
        ]);

        if ("data" in metricsResult) {
          setChartData(metricsResult.data);
        }

        if ("data" in revenueResult) {
          setTotalRevenue(revenueResult.data.total_revenue);
        }
      } catch {
        setError("Failed to load analytics data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-muted animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        </div>
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  if (!hasStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 mx-auto rounded-full bg-muted flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">No Store Found</h2>
            <p className="text-muted-foreground">
              Set up your store to start tracking analytics
            </p>
          </div>
          <Link href="/dashboard/settings">
            <Button size="lg" className="gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Setup Your Store
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <Card className="p-8 max-w-md text-center space-y-4 border-destructive/20 bg-destructive/5">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-destructive font-medium">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  const totalOrders = chartData.reduce((sum, d) => sum + d.order_count, 0);
  const avgOrderValue = chartData.length > 0
    ? chartData.reduce((sum, d) => sum + d.average_order_value, 0) / chartData.length
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View your sales performance over the last 30 days
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                ${totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-secondary/30 border-secondary">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {totalOrders}
              </p>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-accent/5 border-accent/20">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
              <p className="text-2xl sm:text-3xl font-bold text-accent">
                ${avgOrderValue.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Per order</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-muted border-border">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Daily Average</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                ${(totalRevenue / 30).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Revenue per day</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {chartData.length === 0 ? (
        /* Empty State for Charts */
        <Card className="overflow-hidden">
          <div className="bg-muted p-8 sm:p-12">
            <div className="flex flex-col items-center text-center max-w-sm mx-auto space-y-6">
              <div className="w-24 h-24 rounded-2xl bg-secondary flex items-center justify-center">
                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">No sales data yet</h3>
                <p className="text-muted-foreground text-sm">
                  Start making sales to see your analytics charts here
                </p>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Revenue Chart */}
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Revenue Overview</h2>
                  <p className="text-sm text-muted-foreground">Daily sales and order trends</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="total_sales"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                    name="Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Orders Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Orders by Day</h2>
                    <p className="text-sm text-muted-foreground">Number of orders per day</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar 
                      dataKey="order_count" 
                      fill="hsl(var(--chart-1))" 
                      radius={[4, 4, 0, 0]}
                      name="Orders"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Order Value Trend</h2>
                    <p className="text-sm text-muted-foreground">Average order value over time</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Avg Order']}
                    />
                    <Line
                      type="monotone"
                      dataKey="average_order_value"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2 }}
                      name="Average Order Value"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
