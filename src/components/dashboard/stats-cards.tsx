"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { ArrowDown, ArrowUp, DollarSign, TrendingUp, Zap, AlertTriangle } from "lucide-react";

interface StatsCardsProps {
  currentMonthSpend: number;
  lastMonthSpend: number;
  totalRequests: number;
  activeAlerts: number;
}

export function StatsCards({
  currentMonthSpend,
  lastMonthSpend,
  totalRequests,
  activeAlerts,
}: StatsCardsProps) {
  const percentChange = lastMonthSpend > 0
    ? ((currentMonthSpend - lastMonthSpend) / lastMonthSpend) * 100
    : 0;
  const isPositive = percentChange >= 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Month</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(currentMonthSpend)}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {isPositive ? (
              <ArrowUp className="mr-1 h-3 w-3 text-destructive" />
            ) : (
              <ArrowDown className="mr-1 h-3 w-3 text-green-500" />
            )}
            <span className={isPositive ? "text-destructive" : "text-green-500"}>
              {formatPercentage(percentChange)}
            </span>
            <span className="ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Month</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(lastMonthSpend)}</div>
          <p className="text-xs text-muted-foreground">
            Total spend for previous month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">API Requests</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            This month&apos;s total requests
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeAlerts}</div>
          <p className="text-xs text-muted-foreground">
            Alerts monitoring your spend
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
