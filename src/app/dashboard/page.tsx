"use client";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { CostChart } from "@/components/dashboard/cost-chart";
import { ProviderBreakdown } from "@/components/dashboard/provider-breakdown";
import { TopEndpoints } from "@/components/dashboard/top-endpoints";
import {
  generateMockDailyCosts,
  getMockProviderBreakdown,
  getMockTopEndpoints,
  getMockStats,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const stats = getMockStats();
  const dailyCosts = generateMockDailyCosts();
  const providerBreakdown = getMockProviderBreakdown();
  const topEndpoints = getMockTopEndpoints();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Track your API spending and usage at a glance
        </p>
      </div>

      <StatsCards
        currentMonthSpend={stats.currentMonthSpend}
        lastMonthSpend={stats.lastMonthSpend}
        totalRequests={stats.totalRequests}
        activeAlerts={stats.activeAlerts}
      />

      <div className="grid gap-4 md:grid-cols-7">
        <CostChart data={dailyCosts} />
        <ProviderBreakdown data={providerBreakdown} />
      </div>

      <div className="grid gap-4 md:grid-cols-6">
        <TopEndpoints data={topEndpoints} />
        <div className="col-span-3">
          {/* Placeholder for future widget */}
        </div>
      </div>
    </div>
  );
}
