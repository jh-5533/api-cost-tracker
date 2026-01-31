"use client";

import { useState } from "react";
import { ProviderCard } from "@/components/providers/provider-card";
import { AddProviderDialog } from "@/components/providers/add-provider-dialog";
import { getMockProviders } from "@/lib/mock-data";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plug } from "lucide-react";

export default function ApisPage() {
  const [providers, setProviders] = useState(getMockProviders());
  const { toast } = useToast();

  const handleAddProvider = (provider: { name: string; apiKey: string }) => {
    const newProvider = {
      id: String(providers.length + 1),
      name: provider.name,
      status: "active",
      lastSync: "Just now",
      monthlySpend: 0,
      keyMasked: provider.apiKey.slice(0, 4) + "..." + provider.apiKey.slice(-4),
    };
    setProviders([...providers, newProvider]);
  };

  const handleSync = (id: string) => {
    toast({
      title: "Syncing...",
      description: "Fetching latest usage data from provider.",
    });
    // Simulate sync
    setTimeout(() => {
      toast({
        title: "Sync complete",
        description: "Usage data has been updated.",
      });
    }, 2000);
  };

  const handleDelete = (id: string) => {
    setProviders(providers.filter((p) => p.id !== id));
    toast({
      title: "Provider removed",
      description: "The API provider has been removed.",
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Edit provider",
      description: "Edit functionality coming soon.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">API Providers</h2>
          <p className="text-muted-foreground">
            Manage your connected API providers and their credentials
          </p>
        </div>
        <AddProviderDialog onAdd={handleAddProvider} />
      </div>

      {/* Tier Info */}
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Plug className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {providers.length} / 2 providers used
              </p>
              <p className="text-xs text-muted-foreground">
                Free tier allows up to 2 API providers
              </p>
            </div>
          </div>
          <Badge variant="secondary">Free Tier</Badge>
        </CardContent>
      </Card>

      {/* Provider Grid */}
      {providers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onSync={handleSync}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Plug className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No providers connected</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first API provider to start tracking costs
            </p>
            <AddProviderDialog onAdd={handleAddProvider} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
