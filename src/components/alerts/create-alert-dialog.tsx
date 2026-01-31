"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const alertTypes = [
  { value: "budget_limit", label: "Budget Limit", description: "Alert when spending exceeds a dollar amount" },
  { value: "percentage_change", label: "Percentage Change", description: "Alert when daily spending changes by a percentage" },
];

const providers = [
  { value: "all", label: "All Providers" },
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "stripe", label: "Stripe" },
];

interface CreateAlertDialogProps {
  onAdd?: (alert: { name: string; type: string; provider: string; threshold: number }) => void;
}

export function CreateAlertDialog({ onAdd }: CreateAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [provider, setProvider] = useState("");
  const [threshold, setThreshold] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !type || !provider || !threshold) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onAdd?.({
      name,
      type,
      provider: providers.find((p) => p.value === provider)?.label || provider,
      threshold: parseFloat(threshold),
    });

    toast({
      title: "Alert created",
      description: `"${name}" alert has been created.`,
    });

    setLoading(false);
    setOpen(false);
    setName("");
    setType("");
    setProvider("");
    setThreshold("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Alert
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Alert</DialogTitle>
            <DialogDescription>
              Set up a new spending alert to monitor your API costs.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Alert Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Monthly Budget Alert"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Alert Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select alert type" />
                </SelectTrigger>
                <SelectContent>
                  {alertTypes.map((alertType) => (
                    <SelectItem key={alertType.value} value={alertType.value}>
                      <div>
                        <div>{alertType.label}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {type && (
                <p className="text-xs text-muted-foreground">
                  {alertTypes.find((t) => t.value === type)?.description}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="provider">Provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="threshold">
                Threshold {type === "percentage_change" ? "(%)" : "($)"}
              </Label>
              <Input
                id="threshold"
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder={type === "percentage_change" ? "50" : "100"}
                min="0"
                step={type === "percentage_change" ? "1" : "0.01"}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Alert
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
