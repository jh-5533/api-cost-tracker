interface OpenAIUsageResponse {
  object: string;
  data: Array<{
    aggregation_timestamp: number;
    n_requests: number;
    operation: string;
    snapshot_id: string;
    n_context_tokens_total: number;
    n_generated_tokens_total: number;
  }>;
}

interface OpenAICostData {
  date: string;
  requests: number;
  tokens: number;
  cost: number;
}

// OpenAI pricing (approximate, per 1M tokens)
const OPENAI_PRICING: Record<string, { input: number; output: number }> = {
  "gpt-4-turbo": { input: 10, output: 30 },
  "gpt-4": { input: 30, output: 60 },
  "gpt-3.5-turbo": { input: 0.5, output: 1.5 },
  "text-embedding-3-small": { input: 0.02, output: 0 },
  "text-embedding-3-large": { input: 0.13, output: 0 },
  default: { input: 2, output: 6 },
};

export async function fetchOpenAIUsage(
  apiKey: string,
  startDate: Date,
  endDate: Date
): Promise<OpenAICostData[]> {
  const startTimestamp = Math.floor(startDate.getTime() / 1000);
  const endTimestamp = Math.floor(endDate.getTime() / 1000);

  try {
    const response = await fetch(
      `https://api.openai.com/v1/usage?start_time=${startTimestamp}&end_time=${endTimestamp}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data: OpenAIUsageResponse = await response.json();

    // Aggregate by date
    const usageByDate = new Map<string, OpenAICostData>();

    for (const item of data.data) {
      const date = new Date(item.aggregation_timestamp * 1000)
        .toISOString()
        .split("T")[0];

      const existing = usageByDate.get(date) || {
        date,
        requests: 0,
        tokens: 0,
        cost: 0,
      };

      const totalTokens =
        item.n_context_tokens_total + item.n_generated_tokens_total;
      const pricing = OPENAI_PRICING[item.snapshot_id] || OPENAI_PRICING.default;

      // Estimate cost
      const inputCost = (item.n_context_tokens_total / 1_000_000) * pricing.input;
      const outputCost =
        (item.n_generated_tokens_total / 1_000_000) * pricing.output;

      existing.requests += item.n_requests;
      existing.tokens += totalTokens;
      existing.cost += inputCost + outputCost;

      usageByDate.set(date, existing);
    }

    return Array.from(usageByDate.values());
  } catch (error) {
    console.error("Error fetching OpenAI usage:", error);
    throw error;
  }
}
