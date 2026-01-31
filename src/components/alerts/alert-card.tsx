"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, Edit, Bell, BellOff } from "lucide-react";

interface AlertCardProps {
  alert: {
    id: string;
    name: string;
    provider: string;
    type: string;
    threshold: number;
    currentSpend: number;
    status: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggle?: (id: string, enabled: boolean) => void;
}

const alertTypeLabels: Record<string, string> = {
  budget_limit: "Budget Limit",
  percentage_change: "% Change",
  price_threshold: "Price Threshold",
};

export function AlertCard({ alert, onEdit, onDelete, onToggle }: AlertCardProps) {
  const progress = alert.type === "budget_limit"
    ? (alert.currentSpend / alert.threshold) * 100
    : 0;
  const isWarning = progress >= 80;
  const isTriggered = progress >= 100;

  return (
    <Card className={isTriggered ? "border-destructive" : isWarning ? "border-yellow-500" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-md flex items-center justify-center ${
            alert.status === "active" ? "bg-primary/10" : "bg-muted"
          }`}>
            {alert.status === "active" ? (
              <Bell className="h-5 w-5 text-primary" />
            ) : (
              <BellOff className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <CardTitle className="text-base">{alert.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {alertTypeLabels[alert.type] || alert.type}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {alert.provider}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={alert.status === "active"}
            onCheckedChange={(checked) => onToggle?.(alert.id, checked)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(alert.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(alert.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {alert.type === "budget_limit" ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {formatCurrency(alert.currentSpend)} of {formatCurrency(alert.threshold)}
              </span>
              <span className={`font-medium ${
                isTriggered ? "text-destructive" : isWarning ? "text-yellow-500" : ""
              }`}>
                {progress.toFixed(0)}%
              </span>
            </div>
            <Progress
              value={Math.min(progress, 100)}
              className={`h-2 ${
                isTriggered ? "[&>div]:bg-destructive" : isWarning ? "[&>div]:bg-yellow-500" : ""
              }`}
            />
            {isWarning && !isTriggered && (
              <p className="text-xs text-yellow-500">Warning: Approaching budget limit</p>
            )}
            {isTriggered && (
              <p className="text-xs text-destructive">Budget limit exceeded!</p>
            )}
          </div>
        ) : (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              Alert when spending changes by more than{" "}
              <span className="font-medium text-foreground">{alert.threshold}%</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
