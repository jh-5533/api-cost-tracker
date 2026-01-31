"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

interface TopEndpointsProps {
  data: Array<{
    endpoint: string;
    provider: string;
    cost: number;
    requests: number;
  }>;
}

export function TopEndpoints({ data }: TopEndpointsProps) {
  const maxCost = Math.max(...data.map((d) => d.cost), 1);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Top Endpoints</CardTitle>
        <CardDescription>Most expensive API endpoints this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.length > 0 ? (
            data.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate max-w-[200px]">
                      {item.endpoint}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({item.provider})
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="text-xs">{item.requests.toLocaleString()} req</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(item.cost)}
                    </span>
                  </div>
                </div>
                <Progress value={(item.cost / maxCost) * 100} className="h-2" />
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No endpoint data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
