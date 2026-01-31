"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Download, CreditCard, Trash2, Check } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setLoading(true);
    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast({
      title: "Export ready",
      description: "Your data has been exported to CSV.",
    });
    setLoading(false);
  };

  const handleUpgrade = () => {
    toast({
      title: "Upgrade to Pro",
      description: "Stripe checkout coming soon.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                Manage your subscription plan
              </CardDescription>
            </div>
            <Badge>Free Tier</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Plan</p>
              <p className="text-sm text-muted-foreground">
                Free - Track up to 2 API providers with 30 days history
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Next Billing Date</p>
              <p className="text-sm text-muted-foreground">N/A (Free tier)</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="space-y-1">
            <p className="text-sm font-medium">Upgrade to Pro</p>
            <p className="text-xs text-muted-foreground">
              Unlimited providers, 12 months history, email alerts
            </p>
          </div>
          <Button onClick={handleUpgrade}>
            <CreditCard className="mr-2 h-4 w-4" />
            Upgrade - $20/mo
          </Button>
        </CardFooter>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure how you receive alerts and updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email alerts when spending thresholds are reached
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
              <Badge variant="secondary">Pro</Badge>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Report</Label>
              <p className="text-sm text-muted-foreground">
                Get a weekly summary of your API spending
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={weeklyReport}
                onCheckedChange={setWeeklyReport}
              />
              <Badge variant="secondary">Pro</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>
            Export your usage data for external analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Export to CSV</p>
              <p className="text-sm text-muted-foreground">
                Download all your usage data as a CSV file
              </p>
            </div>
            <Button variant="outline" onClick={handleExport} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => {
                toast({
                  title: "Are you sure?",
                  description: "This action cannot be undone.",
                  variant: "destructive",
                });
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
