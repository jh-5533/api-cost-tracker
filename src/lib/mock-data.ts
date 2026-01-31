import { subDays, format } from "date-fns";

// Generate mock daily cost data for the last 30 days
export function generateMockDailyCosts() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(new Date(), i);
    data.push({
      date: format(date, "MMM dd"),
      cost: Math.random() * 50 + 10, // Random cost between $10 and $60
    });
  }
  return data;
}

// Mock provider breakdown
export function getMockProviderBreakdown() {
  return [
    { name: "OpenAI", value: 245.50, color: "hsl(var(--chart-1))" },
    { name: "Anthropic", value: 128.75, color: "hsl(var(--chart-2))" },
    { name: "Stripe", value: 45.20, color: "hsl(var(--chart-3))" },
    { name: "SendGrid", value: 22.10, color: "hsl(var(--chart-4))" },
  ];
}

// Mock top endpoints
export function getMockTopEndpoints() {
  return [
    {
      endpoint: "chat/completions",
      provider: "OpenAI",
      cost: 156.80,
      requests: 12450,
    },
    {
      endpoint: "messages",
      provider: "Anthropic",
      cost: 98.40,
      requests: 8320,
    },
    {
      endpoint: "embeddings",
      provider: "OpenAI",
      cost: 45.20,
      requests: 45000,
    },
    {
      endpoint: "mail/send",
      provider: "SendGrid",
      cost: 22.10,
      requests: 15600,
    },
    {
      endpoint: "charges",
      provider: "Stripe",
      cost: 18.50,
      requests: 890,
    },
  ];
}

// Mock API providers
export function getMockProviders() {
  return [
    {
      id: "1",
      name: "OpenAI",
      status: "active",
      lastSync: "2 hours ago",
      monthlySpend: 245.50,
      keyMasked: "sk-...abc1",
    },
    {
      id: "2",
      name: "Anthropic",
      status: "active",
      lastSync: "3 hours ago",
      monthlySpend: 128.75,
      keyMasked: "sk-ant-...xyz2",
    },
    {
      id: "3",
      name: "Stripe",
      status: "active",
      lastSync: "1 hour ago",
      monthlySpend: 45.20,
      keyMasked: "sk_test_...def3",
    },
  ];
}

// Mock alerts
export function getMockAlerts() {
  return [
    {
      id: "1",
      name: "OpenAI Monthly Budget",
      provider: "OpenAI",
      type: "budget_limit",
      threshold: 300,
      currentSpend: 245.50,
      status: "active",
    },
    {
      id: "2",
      name: "Anthropic Warning",
      provider: "Anthropic",
      type: "budget_limit",
      threshold: 150,
      currentSpend: 128.75,
      status: "active",
    },
    {
      id: "3",
      name: "Daily Spike Alert",
      provider: "All",
      type: "percentage_change",
      threshold: 50,
      currentSpend: 0,
      status: "active",
    },
  ];
}

// Mock stats
export function getMockStats() {
  return {
    currentMonthSpend: 441.55,
    lastMonthSpend: 385.20,
    totalRequests: 82260,
    activeAlerts: 3,
  };
}
