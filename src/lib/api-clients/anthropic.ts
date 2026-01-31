interface AnthropicUsageData {
  date: string;
  requests: number;
  tokens: number;
  cost: number;
}

// Anthropic pricing (per 1M tokens)
const ANTHROPIC_PRICING: Record<string, { input: number; output: number }> = {
  "claude-3-opus": { input: 15, output: 75 },
  "claude-3-sonnet": { input: 3, output: 15 },
  "claude-3-haiku": { input: 0.25, output: 1.25 },
  "claude-2.1": { input: 8, output: 24 },
  "claude-2.0": { input: 8, output: 24 },
  "claude-instant-1.2": { input: 0.8, output: 2.4 },
  default: { input: 3, output: 15 },
};

export async function fetchAnthropicUsage(
  apiKey: string,
  startDate: Date,
  endDate: Date
): Promise<AnthropicUsageData[]> {
  // Note: Anthropic doesn't have a public usage API yet
  // This is a placeholder that would need to be updated
  // when/if they release one

  try {
    // For now, we'll simulate by tracking usage through a middleware
    // In production, you'd integrate with Anthropic's billing dashboard
    // or use a proxy to track usage

    // Placeholder - return empty array
    // Real implementation would fetch from your own usage tracking
    console.log("Anthropic usage API not yet available");
    return [];
  } catch (error) {
    console.error("Error fetching Anthropic usage:", error);
    throw error;
  }
}

// Helper to calculate cost from token counts
export function calculateAnthropicCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = ANTHROPIC_PRICING[model] || ANTHROPIC_PRICING.default;
  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;
  return inputCost + outputCost;
}
