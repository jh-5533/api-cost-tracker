"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface ProviderBreakdownProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export function ProviderBreakdown({ data }: ProviderBreakdownProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Cost by Provider</CardTitle>
        <CardDescription>Breakdown of spending by API provider</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {formatCurrency(item.value)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {((item.value / total) * 100).toFixed(1)}% of total
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
