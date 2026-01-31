"use client";

import { useState } from "react";
import { AlertCard } from "@/components/alerts/alert-card";
import { CreateAlertDialog } from "@/components/alerts/create-alert-dialog";
import { getMockAlerts } from "@/lib/mock-data";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(getMockAlerts());
  const { toast } = useToast();

  const handleAddAlert = (alert: {
    name: string;
    type: string;
    provider: string;
    threshold: number;
  }) => {
    const newAlert = {
      id: String(alerts.length + 1),
      name: alert.name,
      provider: alert.provider,
      type: alert.type,
      threshold: alert.threshold,
      currentSpend: 0,
      status: "active",
    };
    setAlerts([...alerts, newAlert]);
  };

  const handleToggle = (id: string, enabled: boolean) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id
          ? { ...alert, status: enabled ? "active" : "disabled" }
          : alert
      )
    );
    toast({
      title: enabled ? "Alert enabled" : "Alert disabled",
      description: `The alert has been ${enabled ? "enabled" : "disabled"}.`,
    });
  };

  const handleDelete = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
    toast({
      title: "Alert deleted",
      description: "The alert has been removed.",
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Edit alert",
      description: "Edit functionality coming soon.",
    });
  };

  const activeAlerts = alerts.filter((a) => a.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alerts</h2>
          <p className="text-muted-foreground">
            Configure spending alerts to stay within budget
          </p>
        </div>
        <CreateAlertDialog onAdd={handleAddAlert} />
      </div>

      {/* Alert Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeAlerts}</p>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Mail className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Get notified when alerts are triggered
                </p>
              </div>
            </div>
            <Badge variant="secondary">Pro Feature</Badge>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Alerts List */}
      {alerts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No alerts configured</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create an alert to start monitoring your API spending
            </p>
            <CreateAlertDialog onAdd={handleAddAlert} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
