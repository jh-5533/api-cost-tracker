"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, RefreshCw, Trash2, Edit, Key } from "lucide-react";

interface ProviderCardProps {
  provider: {
    id: string;
    name: string;
    status: string;
    lastSync: string;
    monthlySpend: number;
    keyMasked: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSync?: (id: string) => void;
}

const providerLogos: Record<string, string> = {
  OpenAI: "OA",
  Anthropic: "AN",
  Stripe: "ST",
  SendGrid: "SG",
  Nansen: "NA",
};

export function ProviderCard({ provider, onEdit, onDelete, onSync }: ProviderCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center font-semibold text-primary">
            {providerLogos[provider.name] || provider.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <CardTitle className="text-base">{provider.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Key className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono">
                {provider.keyMasked}
              </span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSync?.(provider.id)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Now
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(provider.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(provider.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Monthly Spend</p>
            <p className="text-2xl font-bold">{formatCurrency(provider.monthlySpend)}</p>
          </div>
          <div className="text-right space-y-1">
            <Badge variant={provider.status === "active" ? "success" : "secondary"}>
              {provider.status}
            </Badge>
            <p className="text-xs text-muted-foreground">
              Last sync: {provider.lastSync}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
